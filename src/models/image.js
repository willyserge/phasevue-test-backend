import mongoose, { Schema } from 'mongoose';


const imageSchema = new Schema(
  {
    image: {
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
