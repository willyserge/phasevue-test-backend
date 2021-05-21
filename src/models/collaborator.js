import mongoose, { Schema } from 'mongoose';

const phaseSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'viewer'
    }
  },
  {
    timestamps: true
  }
);

const Phase = mongoose.model('Phase', phaseSchema);
export default Phase;
