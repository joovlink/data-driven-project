// src/controllers/skill.controller.js
import Profile from "../models/profile.model.js";

// ✅ Get skills & languages
export const getSkillsAndLanguages = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).select(
      "skills languages"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update skills & languages
export const updateSkillsAndLanguages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { hardSkill, softSkill, languages } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          "skills.hardSkill": hardSkill,
          "skills.softSkill": softSkill,
          languages,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
