import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    project: {
      type: Array,
      required: true
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      text: true
    },
    createdBy: { type: ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
