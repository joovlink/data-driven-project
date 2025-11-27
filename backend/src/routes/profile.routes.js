import express from "express";
import {
  createProfile,
  getProfiles,
  getProfileByUser,
  getGeneralInfo,
  updateGeneralInfo,
  getSkillsAndLanguages,
  updateSkillsAndLanguages,
  getExperience,
  updateExperience,
  getEducation,
  updateEducation,
} from "../controllers/index.js";

const router = express.Router();

// 🧠 base profile
router.post("/", createProfile);
router.get("/", getProfiles);
router.get("/:userId", getProfileByUser);

// 👤 general info
router.get("/:userId/general", getGeneralInfo);
router.put("/:userId/general", updateGeneralInfo);

// 🧩 skill & language
router.get("/:userId/skills", getSkillsAndLanguages);
router.put("/:userId/skills", updateSkillsAndLanguages);

// 💼 experience
router.get("/:userId/experience", getExperience);
router.put("/:userId/experience", updateExperience);

// 🎓 education
router.get("/:userId/education", getEducation);
router.put("/:userId/education", updateEducation);

export default router;
