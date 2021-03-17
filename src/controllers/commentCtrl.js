/* eslint-disable no-underscore-dangle */
import Comment from '../models/comment';
import Deliverable from '../models/deliverable';

const Comments = {

  async getDeliverableComments(req, res) {
    const comments = await Deliverable.find({ _id: req.body.id }).populate('comments').sort({ createdAt: -1 });
    res.status(200).json(comments);
  },

  async createComments(req, res) {
    req.body.commenter = req.user._id;
    const newComment = new Comment(req.body);
    const comment = await newComment.save();
    const DeliverableComment = await Deliverable.findOneAndUpdate(
      { _id: req.body.id }, { $push: { comments: comment._id } }, { new: true }
    );
    return res.status(201).json(DeliverableComment);
  }
};

export default Comments;
