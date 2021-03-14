import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const goalsSchema = new mongoose.Schema(
  {
    goal: {
      type: String,
      required: true
    },
    isCompleted: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Goal = mongoose.model('Project', goalsSchema);
export default Goal;
