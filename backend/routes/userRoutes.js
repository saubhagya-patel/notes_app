import express from "express";


import { authMiddleware } from "../middlewares/index.js";
import { userController } from "../controllers/index.js";


const router = express.Router();

// Protected route to update profile
router.put("/update-profile", authMiddleware.protect, userController.updateProfile);

export default router;
