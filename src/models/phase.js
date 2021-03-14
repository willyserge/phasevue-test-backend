import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Schema;

const phaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'incomplete'
    },
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  },
  {
    timestamps: true
  }
);

const Phase = mongoose.model('Phase', phaseSchema);
export default Phase;
