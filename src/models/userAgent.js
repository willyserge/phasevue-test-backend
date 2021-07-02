import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema;

const userAgentSchema = new Schema(
  {
    loginType: {
      type: String,
      required: true
    },
    ip: {
      type: String
    },
    client: {
      os: { type: String },
      browser: { type: String }
    },
    user: { type: ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const UserAgent = mongoose.model('UserAgent', userAgentSchema);
export default UserAgent;
