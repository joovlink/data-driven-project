import mongoose from "mongoose";

const savedWorkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // user yang save
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobListing",
      required: true, // job yang disave
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SavedWork = mongoose.model("SavedWork", savedWorkSchema);
export default SavedWork;
