import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user';
import { createAccessToken } from '../utils';
import inviteMail from '../utils/inviteMail';
import resetMail from '../utils/resetMail';
import clientInviteMail from '../utils/clientInviteMail';
import Project from '../models/project';
import DeliverableInvite from '../models/deliverableInvite';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const UserController = {
  async getAllUsers(req, res) {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  },

  async userInfo(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  },

  async updateProfilePicture(req, res) {
    const { userId, picture_url, picture_id } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      picture: picture_url
    }, { new: true });
    res.status(200).json(user);
  },

  async updateName(req, res) {
    const { name } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      name
    }, { new: true });
    res.status(200).json({ message: 'success' });
  },

  async updatePassword(req, res) {
    const { password, newPassword } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const isMatch = await bcrypt.compare(password, user.password);
    // check if password matches
    if (!isMatch) return res.status(400).send({ msg: 'Current password is incorrect.' });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, {
      password: passwordHash
    }, { new: true });
    return res.status(200).json({ message: 'success' });
  },

  async updateEmail(req, res) {
    const { email } = req.body;
    if (req.user.email === email) return res.status(400).json({ error: { msg: 'enter a different email' } });
    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: { msg: 'email already in use' } });
    const newUserData = await User.findByIdAndUpdate(req.user.id, { email }, { new: true });
    const accessToken = createAccessToken({
      id: newUserData._id,
      email: newUserData.email,
      name: newUserData.name
    });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(200).json({ message: newUserData });
  },


  async sendResetEmail(req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ msg: 'That user doesn’t exist' });

    const resetToken = createAccessToken(
      {
        email: req.body.email
      }
    );
    const RESET_URL = process.env.RESET_CLIENT_URL;
    const url = `${RESET_URL}/reset/${resetToken}`;
    resetMail({
      email: req.body.email,
      url
    });
    return res.status(200).json('invite sent');
  },

  async verifyResetToken(req, res) {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      return res.status(200).json('the token is valid');
    }

    return res.status(400).json({ error: 'invalid or expired token' });
  },

  async resetPassword(req, res) {
    const { token, password } = req.body;
    const details = jwt.verify(token, process.env.JWT_SECRET);

    const newPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email: details.email },
      { password: newPassword },
      { new: true }
    );
    return res.status(200).json('password successfully updated');
  },

  async projectInvite(req, res) {
    const { projectId, projectName, email } = req.body;
    const inviteToken = createAccessToken(
      {
        projectId,
        projectName,
        email,
        inviter: req.user.name
      }
    );
    const CLIENT_URL = process.env.INVITE_CLIENT_URL;
    const url = `${CLIENT_URL}/project/invite/${inviteToken}`;
    inviteMail({
      email: req.body.email,
      url,
      projectName: req.body.projectName,
      inviter: req.user.name
    });
    res.status(200).json('invite sent');
  },

  async clientInvite(req, res) {
    const {
      deliverableId, deliverableName, clientEmail, projectId, projectName
    } = req.body;

    const id = uuidv4();
    const newInvite = new DeliverableInvite({
      id,
      deliverableId,
      deliverableName,
      projectId,
      projectName,
      clientEmails: clientEmail
    });
    const invite = await newInvite.save();

    // send email to multiple clients
    invite.clientEmails.forEach((email) => {
      const CLIENT_URL = process.env.INVITE_CLIENT_URL;
      const url = `${CLIENT_URL}/deliverable/review-request/${id}?email=${email}`;

      clientInviteMail({
        email,
        url,
        deliverableName,
        projectName,
        inviter: req.user.name
      });
    });

    res.status(200).json('email sent');
  },

  /* check if a client already has an account,
   log in him automatically without a password if he already has one */

  async checkIfClientHasAccount(req, res) {
    const { token } = req.params;
    const { clientEmail, deliverableId, projectId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: clientEmail[0] });
    if (!user) res.status(400).send({ error: { msg: 'client has no account' } });
    const accessToken = createAccessToken({ id: user._id, email: user.email });

    await Project.updateOne(
      { _id: projectId },
      { $addToSet: { collaborators: [user.email], viewers: [user.email] } }
    );
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(201).send({ deliverableId });
  },


  async deleteUser(req, res) {
    await User.remove({ _id: req.params.id });
    res.status(200).json({ message: 'Successfully deleted. ' });
  }
};


export default UserController;
