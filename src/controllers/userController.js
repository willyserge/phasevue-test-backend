import User from '../models/user';
import { createAccessToken } from '../utils';
import inviteMail from '../utils/inviteMail';

const UserController = {
  async getAllUsers(req, res) {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  },

  async userInfo(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  },

  async projectInvite(req, res) {
    const inviteToken = createAccessToken(
      {
        projectId: req.body.projectId,
        projectName: req.body.projectName,
        email: req.body.email,
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
