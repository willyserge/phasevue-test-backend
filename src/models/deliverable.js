import mongoose, { Schema } from 'mongoose';

const deliverableSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      text: true
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
