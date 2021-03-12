import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500
    },
    picture: {
      type: String
    },
    video: {
      type: String
    },
    likers: {
      type: [String],
      required: true
    },
    comments: {
      type: [
        {
          commenterId: String,
          commenterUsername: String,
          text: String,
          timestamp: Number
        }
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
