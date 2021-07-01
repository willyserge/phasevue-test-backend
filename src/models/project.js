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
      ref: 'User'
    }],
    clients: {
      type: Array,
      required: true
    },
    viewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    admins: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdBy: { type: ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
