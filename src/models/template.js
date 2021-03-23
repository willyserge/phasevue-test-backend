import mongoose, { Schema } from 'mongoose';

const templateSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    phases: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Template = mongoose.model('Template', templateSchema);
export default Template;
