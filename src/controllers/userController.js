import jwt from 'jsonwebtoken';

import User from '../models/user';
import { createAccessToken } from '../utils';
import inviteMail from '../utils/inviteMail';
import resetMail from '../utils/resetMail';

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
      picture: picture_url,
    }, {new: true});
    res.status(200).json(user);
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
    const { token } = req.body;
    const details = jwt.verify(token, process.env.JWT_SECRET);


    return res.status(200).json(details);
  },

  async projectInvite(req, res) {
    const inviteToken = createAccessToken(
      {
        projectId: req.body.projectId,
        projectName: req.body.projectName,
        email: req.body.email,
        inviteAs: req.body.inviteAs,
        inviter: req.user.names
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


  async deleteUser(req, res) {
    await User.remove({ _id: req.params.id });
    res.status(200).json({ message: 'Successfully deleted. ' });
  }
};


export default UserController;
