/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';

import User from '../models/user';
import { createAccessToken } from '../utils';

const maxAge = 3 * 24 * 60 * 60 * 1000;


const Auth = {
  async signup(req, res) {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) res.status(409).send({ error: { msg: 'email already exists' } });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: passwordHash });

    await newUser.save();
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
      httpOnly: false, secure: true, sameSite: 'none', maxAge
    });
    return res.status(200).send({ accessToken });
  },

  logout(req, res) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }
};
export default Auth;
