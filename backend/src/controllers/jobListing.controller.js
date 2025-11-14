import JobListing from "../models/jobListing.model.js";

// Create new job listing
export const createJobListing = async (req, res) => {
  try {
    const job = new JobListing(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all job listings
export const getJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get latest 10 jobs (for not logged-in users)
export const getNewJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find().sort({ createdAt: -1 }).limit(10);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
