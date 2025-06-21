import express from "express";
import { authController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";


const router = express.Router();

router.post("/google-login", authController.googleLogin);
router.get("/me", authMiddleware.protect, authController.getCurrentUser)
router.post("/logout", authController.logOut)


export default router;
