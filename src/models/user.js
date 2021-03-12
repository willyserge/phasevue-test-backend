import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: './uploads/profil/random-user.png'
    },
    bio: {
      type: String,
      max: 1024
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
export default User;
