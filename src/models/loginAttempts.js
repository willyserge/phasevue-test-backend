import mongoose, { Schema } from 'mongoose';


const loginAttempSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const LoginAttempt = mongoose.model('LoginAttempt', loginAttempSchema);
export default LoginAttempt;
