import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import profilRoutes from "./routes/profile.routes.js";
import jobListingRoutes from "./routes/jobListing.routes.js"

// Load env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Routes Profile
app.use("/api/profile", profilRoutes);
app.use("/api/job-listings", jobListingRoutes);

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
