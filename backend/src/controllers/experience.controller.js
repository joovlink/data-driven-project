import Profile from "../models/profile.model.js";

// GET experiences
export const getExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).select("workingExperience");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE experiences
export const updateExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    const { workingExperience } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { workingExperience } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
