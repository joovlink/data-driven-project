// controllers/savedWork.controller.js
import SavedWork from "../models/savedWorkModel.js";
import JobListing from "../models/jobListingModel.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id; // dari middleware auth

    // Cek apakah job-nya valid
    const job = await JobListing.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Cek apakah udah disave sebelumnya
    const existing = await SavedWork.findOne({ user: userId, job: jobId });
    if (existing)
      return res.status(400).json({ message: "Job already saved" });

    const saved = await SavedWork.create({ user: userId, job: jobId });
    res.status(201).json({
      message: "Job saved successfully",
      saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedJobs = await SavedWork.find({ user: userId }).populate("job");

    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const { id } = req.params; // id dari savedWork
    const userId = req.user.id;

    const deleted = await SavedWork.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Saved job not found" });

    res.status(200).json({ message: "Saved job removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
