/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import useragent from 'express-useragent';
import ip from 'ip';

import LoginAttempt from '../models/loginAttempts';
import User from '../models/user';
import { createAccessToken } from '../utils';
import passwordlessLoginMail from '../utils/pwLoginMail';
import WelcomeMail from '../utils/welcomeMail';
import UserAgent from '../models/userAgent';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const Auth = {
  async signup(req, res) {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ error: { msg: 'email already exists' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: passwordHash });

    const registeredUser = await newUser.save();
    WelcomeMail(registeredUser.email, registeredUser.name);
    return res.status(201).json({ success: true });
  },

  async signin(req, res) {
    const { email, password } = req.body;
    const source = req.headers['user-agent'];
    const { browser, os } = useragent.parse(source);

    const ipAddress = ip.address();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ msg: 'Incorrect password.' });

    const newUserAgent = new UserAgent({
      loginType: 'Credentials login',
      ip: ipAddress,
      client: {
        os,
        browser
      },
      user: user._id
    });
    await newUserAgent.save();
    // If login success , create access token and cookie
    const accessToken = createAccessToken({ id: user._id, email: user.email, name: user.name });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(201).json({ success: true });
  },
  checkCookie(req, res) {
    if (req.cookies.jwt) {
      return res.status(200).json('cookie available');
    }
    return res.status(400).json('no cookie found');
  },

  // passwordless authentication start

  async identify(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });
    const id = uuidv4();
    const newLoginAttempt = new LoginAttempt({ email, id });
    await newLoginAttempt.save();
    const url = `${process.env.VERIFY_CLIENT_URL}/verify/${id}`;
    passwordlessLoginMail({ email: user.email, url });
    return res.status(200).json({ success: true });
  },

  async verify(req, res) {
    const { id } = req.params;
    const attempt = await LoginAttempt.findOne({ id });
    if (!attempt) return res.status(400).json({ error: 'invalid page' });
    const user = await User.findOne({ email: attempt.email }).select('-password');

    const accessToken = createAccessToken({ id: user._id, email: user.email, name: user.name });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    // delete login id after use, link can only be used once
    await LoginAttempt.deleteOne({ id });
    return res.status(200).json({ success: true });
  },

  // passwordless register

  async passwordlessRegister(req, res) {
    const { name, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ error: { msg: 'email already exists' } });
    }
    const newUser = new User({ name, email });
    const registeredUser = await newUser.save();
    WelcomeMail(registeredUser.email, registeredUser.name);
    const accessToken = createAccessToken({
      id: registeredUser._id, email: registeredUser.email, name: registeredUser.name
    });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(201).json({ success: true });
  },

  logout(req, res) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }

};
export default Auth;
