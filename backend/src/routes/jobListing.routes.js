import express from "express";
import {
  createJobListing,
  getJobListings,
  getNewJobListings,
} from "../controllers/jobListing.controller.js";

const router = express.Router();

router.post("/", createJobListing);
router.get("/", getJobListings);
router.get("/new", getNewJobListings);

export default router;
