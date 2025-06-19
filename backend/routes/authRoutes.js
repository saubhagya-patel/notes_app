import express from "express";
import { googleLogin, getCurrentUser } from "../controllers/authController.js";
// import { verifyToken } from "../controllers/auth.js";


const router = express.Router();
router.post("/google-login", googleLogin);
router.get("/me",getCurrentUser)
// router.post("/verify-token", verifyToken);


export default router;
