import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema;

const deliverableSchema = new Schema(
  {
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
