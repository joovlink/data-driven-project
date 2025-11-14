// routes/savedWork.routes.js
import express from "express";
import { saveJob, getSavedJobs, removeSavedJob } from "../controllers/savedWork.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // middleware JWT misal

const router = express.Router();

router.post("/", verifyToken, saveJob);       // Save job
router.get("/", verifyToken, getSavedJobs);   // Get all saved jobs user
router.delete("/:id", verifyToken, removeSavedJob); // Remove saved job

export default router;
