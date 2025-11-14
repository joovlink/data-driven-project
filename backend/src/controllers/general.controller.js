import Profile from "../models/profile.model.js";

// GET general info
export const getGeneralInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).select(
      "fullName bornPlace bornDate phoneNumber shortProfile"
    );

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE general info
export const updateGeneralInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateFields = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
