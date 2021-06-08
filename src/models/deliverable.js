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
    complete: {
      type: Boolean,
      default: false
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    images: [{
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  },
  {
    timestamps: true
  }
);

const Deliverable = mongoose.model('Deliverable', deliverableSchema);
export default Deliverable;
