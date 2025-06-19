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
        profilePicture: picture,
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


export const  getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
