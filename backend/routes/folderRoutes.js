import express from "express";


import { authMiddleware } from "../middlewares/index.js";
import { folderController } from "../controllers/index.js";


const router = express.Router();

router.post("/", authMiddleware.protect, folderController.createFolder);
router.get("/", authMiddleware.protect, folderController.getUserFolders);
router.delete("/:id", authMiddleware.protect, folderController.deleteFolder);


export default router;
