import Profile from "../models/profile.model.js";

// GET education
export const getEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).select("education");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE education
export const updateEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { education } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { education } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
