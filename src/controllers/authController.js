/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import LoginAttempt from '../models/loginAttempts';
import LoginAttempts from '../models/loginAttempts';

import Project from '../models/project';
import User from '../models/user';
import { createAccessToken } from '../utils';
import WelcomeMail from '../utils/welcomeMail';

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
    const accessToken = createAccessToken({ id: newUser._id, email: newUser.email });
    return res.status(201).send({ accessToken });
  },

  async signin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ msg: 'Incorrect password.' });

    // If login success , create access token and cookie
    const accessToken = createAccessToken({ id: user._id, email: user.email, name: user.name });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(200).send({ accessToken });
  },
  checkCookie(req, res) {
    if (req.cookies.jwt) {
      return res.status(200).json('cookie available');
    }
    return res.status(400).json('no cookie found');
  },

  async registerNewClient(req, res) {
    const { token, name } = req.body;
    const { clientEmail, deliverableId, projectId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: clientEmail[0] });

    if (user) res.status(409).send({ error: { msg: 'email already exists' } });

    const newUser = new User({ name, email: clientEmail[0], client: true });

    const registeredUser = await newUser.save();

    // add client to project collaborators
    await Project.updateOne(
      { _id: projectId },
      { $addToSet: { collaborators: [registeredUser.email], viewers: [registeredUser.email] } }
    );
    WelcomeMail(registeredUser.email);
    const accessToken = createAccessToken({
      id: newUser._id, email: newUser.email, name: newUser.name
    });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(201).send({ deliverableId });
  },

  // passwordless authentication start

  async identify(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: 'User does not exist.' });
    const id = uuidv4();
    const newLoginAttempt = new LoginAttempt({ email, id });
    await newLoginAttempt.save();
    return res.status(200).json({ success: true });
  },


  logout(req, res) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }

};
export default Auth;
