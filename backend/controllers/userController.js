import User from "../models/User.js";


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Comes from requireAuth middleware
    const { institution, semester, profilePic, subjects } = req.body;

    if (!institution || !semester || !Array.isArray(subjects)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        institution,
        semester,
        profilePic,
        subjects,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
