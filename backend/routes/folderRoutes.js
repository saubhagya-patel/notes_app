import express from "express";
import { authMiddleware } from "../middlewares/index.js";
import { folderController } from "../controllers/index.js";

const router = express.Router();


// GET all public folders.
router.get("/all", folderController.getAllPublicFolders);

// GET all folders for a user.
router.get("/", authMiddleware.protect, folderController.getUserFolders);

// GET folders filtered by subject (e.g., /api/folders/subject?name=Physics)
router.get("/subject", authMiddleware.protect, folderController.getSubjectFolders);

// POST a new folder
router.post("/", authMiddleware.protect, folderController.createFolder);



// GET a single folder by its ID
router.get("/:folderId", authMiddleware.protect, folderController.getFolder);

// DELETE a folder by its ID
router.delete("/:id", authMiddleware.protect, folderController.deleteFolder);


export default router;
