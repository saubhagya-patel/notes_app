import express from "express";


import { protect } from "../middlewares/auth.js";
import {
  createFolder,
  getUserFolders,
  deleteFolder,
} from "../controllers/folderController.js";


const router = express.Router();

router.post("/", protect, createFolder);
router.get("/", protect, getUserFolders);
router.delete("/:id", protect, deleteFolder);


export default router;
