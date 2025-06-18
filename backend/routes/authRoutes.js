import express from "express";
import { googleLogin } from "../controllers/authController.js";
// import { verifyToken } from "../controllers/auth.js";

const router = express.Router();
router.post("/google-login", googleLogin);
// router.post("/verify-token", verifyToken);

export default router;
