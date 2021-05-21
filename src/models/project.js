import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    phases: [{
      type: Schema.Types.ObjectId,
      ref: 'Phase'
    }],
    collaborators: [{
      type: Schema.Types.ObjectId,
      ref: 'Collaborator'
    }],
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
