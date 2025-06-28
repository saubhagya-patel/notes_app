import express from "express";


import { authMiddleware, multerMiddleware } from "../middlewares/index.js";
import { noteController } from "../controllers/index.js";


const router = express.Router();

// Protected routes
router.post("/upload", authMiddleware.protect, multerMiddleware.upload.single("file"), noteController.uploadNote);
router.get("/:id", authMiddleware.protect, noteController.getNote);
router.delete("/:id", authMiddleware.protect, noteController.deleteNote);
router.post("/share/:id", authMiddleware.protect, noteController.generateShareLink);
router.post("/request-access/:id", authMiddleware.protect, noteController.requestAccess);
router.patch("/close-link/:id", authMiddleware.protect, noteController.closeShareLink);


export default router;
