import express from "express";
import { authController } from "../controllers/index.js";
// import { verifyToken } from "../controllers/auth.js";


const router = express.Router();
router.post("/google-login", authController.googleLogin);
router.get("/me", authController.getCurrentUser)
// router.post("/verify-token", verifyToken);


export default router;
