import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema;

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    commenter: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
