// routes/index.js
import express from "express";
import jobListingRoutes from "./jobListing.routes.js";
import savedWorkRoutes from "./savedWork.routes.js";

const router = express.Router();

router.use("/job-listings", jobListingRoutes);
router.use("/saved-work", savedWorkRoutes);

export default router;
