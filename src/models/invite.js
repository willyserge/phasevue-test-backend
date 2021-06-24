import mongoose, { Schema } from 'mongoose';


const inviteSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Invite = mongoose.model('Invite', inviteSchema);
export default Invite;
