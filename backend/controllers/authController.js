// controllers/authController.js
import jwt from "jsonwebtoken";


import { firebaseAdminUtil } from "../utils/index.js";
import { User } from "../models/index.js";


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await firebaseAdminUtil.auth().verifyIdToken(idToken);

    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
        profilePic: picture,
      });
    }
    console.log(user);

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ success: false, message: "Invalid ID token" });
  }
};
