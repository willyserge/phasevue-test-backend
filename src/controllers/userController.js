import User from '../models/user';

const UserController = {
  async getAllUsers(req, res) {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  },

  async userInfo(req, res) {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  },

  async deleteUser(req, res) {
    await User.remove({ _id: req.params.id });
    res.status(200).json({ message: 'Successfully deleted. ' });
  }
};


export default UserController;
