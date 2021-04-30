import mongoose, { Schema } from 'mongoose';


const imageSchema = new Schema(
  {
    url: {
      type: String
    },
    public_id: {
      type: String
    },
    Annotations: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

const Image = mongoose.model('Image', imageSchema);
export default Image;
