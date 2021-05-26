/* eslint-disable no-underscore-dangle */
import Comment from '../models/comment';
import Deliverable from '../models/deliverable';

const Comments = {

  async getDeliverableComments(req, res) {
    const comments = await Deliverable.find({ _id: req.params.deliverableId }).populate({
      path: 'comments', // populate phases
      populate: {
        path: 'commenter' // in phases, populate deliverables
      }
    }).populate('images').sort({ createdAt: -1 });
    res.status(200).json(comments);
  },

  async createComments(req, res) {
    req.body.commenter = req.user.id;
    const newComment = new Comment(req.body);
    const comment = await newComment.save();
    const DeliverableComment = await Deliverable.findOneAndUpdate(
      { _id: req.body.id }, { $push: { comments: comment._id } }, { new: true }
    );
    return res.status(201).json(DeliverableComment);
  },

  async deleteComment(req, res) {
    const { commentId } = req.params;
    await Comment.findByIdAndRemove(commentId);
    res.status(200).json({ message: 'comment deleted successfully' });
  }
};

export default Comments;
