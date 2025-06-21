import express from "express";
import { updateProfile } from "../controllers/userController.js";
import {protect} from "../middlewares/auth.js";

const router = express.Router();

// Protected route to update profile
router.put("/update-profile", protect, updateProfile);

export default router;
