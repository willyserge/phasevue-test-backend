/* eslint-disable no-underscore-dangle */
import Post from '../models/post';
import User from '../models/user';

const Posts = {

  async getAllPosts(req, res) {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  }

};

export default Posts;
