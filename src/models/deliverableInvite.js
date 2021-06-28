import mongoose, { Schema } from 'mongoose';


const deliverableInviteSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    deliverableId: {
      type: String,
      required: true
    },
    deliverableName: {
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
    },
    clientEmails: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const DeliverableInvite = mongoose.model('DeliverableInvite', deliverableInviteSchema);
export default DeliverableInvite;
