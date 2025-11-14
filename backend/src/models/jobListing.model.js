import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema(
  {
    companyLogo: { type: String },
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    location: {
      city: { type: String },
      country: { type: String },
    },
    employmentType: {
      type: String,
      enum: ["Fulltime", "Part-time", "Freelance"],
      required: true,
    },
    minExperience: { type: String }, // contoh: "2 years"
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: "IDR" },
    },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Virtual biar bisa dapet "3 hours ago" di frontend
jobListingSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.postedAt.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return hours < 24 ? `${hours} hours ago` : `${Math.floor(hours / 24)} days ago`;
});

const JobListing = mongoose.model("JobListing", jobListingSchema);
export default JobListing;
