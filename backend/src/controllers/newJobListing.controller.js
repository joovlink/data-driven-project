// controllers/jobListingController.js
import JobListing from "../models/jobListingModel.js";

export const getNewJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find()
      .sort({ createdAt: -1 }) // urut dari terbaru
      .limit(10); // ambil max 10

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
