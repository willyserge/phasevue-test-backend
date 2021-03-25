import mongoose, { Schema } from 'mongoose';

const deliverableSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  {
    timestamps: true
  }
);

const Deliverable = mongoose.model('Deliverable', deliverableSchema);
export default Deliverable;
