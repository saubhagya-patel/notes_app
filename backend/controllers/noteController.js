import mongoose from "mongoose";
import crypto from "crypto";


import { Folder, Note } from "../models/index.js";
import { cloudinaryUtil } from "../utils/index.js";
import { ALLOWED_FILE_TYPES } from "../models/Note.js";


const streamUpload = (file) => {
  const fileBuffer = file.buffer;
  const fileName = file.originalname;

  const ext = fileName.split(".").pop().toLowerCase();
  const imageTypes = ["jpg", "jpeg", "png", "gif", "pdf"];
  const resourceType = imageTypes.includes(ext) ? "image" : "auto";


  return new Promise((resolve, reject) => {
    cloudinaryUtil.uploader.upload_stream(
      { resource_type: resourceType, folder: "notes_manager" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

const areUploadParamsValid = async (title, folderId, file, req) => {
  if (!title || typeof title !== "string") {
    return false;
  }

  if (!file) {
    return false;
  }

  const ext = file.originalname.split(".").pop().toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(ext)) {
    return false;
  }


  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return false;
  }

  const folder = await Folder.findById(folderId);
  if (!folder || !folder.owner.equals(req.user._id)) {
    return false;
  }

  return true;
}


// POST /api/notes/upload
export const uploadNote = async (req, res) => {
  try {
    const { title, folderId } = req.body;
    const file = req.file;

    const paramsValid = await areUploadParamsValid(title, folderId, file, req)
    if (!paramsValid) {
      return res.status(400).json({ success: false, message: "Invalid parameters" });
    }
    // console.log(file)

    const result = await streamUpload(file);
    // console.log(result)

    const note = await Note.create({
      title,
      fileUrl: result.secure_url,
      fileType: result.format,
      folder: folderId,
      owner: req.user._id,
    });

    await Folder.findByIdAndUpdate(folderId, { $push: { notes: note._id } });

    res.status(201).json({ success: true, note });

  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
};



// GET /api/notes/:id
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("owner", "name email");

    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (!note.isShared && !note.owner._id.equals(req.user._id))
      return res.status(403).json({ success: false, message: "Access denied" });

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching note" });
  }
};


// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (!note.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await Note.findByIdAndDelete(note._id);
    await Folder.findByIdAndUpdate(note.folder, { $pull: { notes: note._id } });

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};


// POST /api/notes/share/:id
export const generateShareLink = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const token = crypto.randomBytes(16).toString("hex");

    note.isShared = true;
    note.shareToken = token;
    await note.save();

    res.json({ success: true, shareUrl: `/api/notes/shared/${token}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error generating share link" });
  }
};


// POST /api/notes/request-access/:id (placeholder)
// TODO
export const requestAccess = async (req, res) => {
  res.json({ success: true, message: "Request access feature not implemented." });
};


// PATCH /api/notes/close-link/:id
export const closeShareLink = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: "Unauthorized" });

    note.isShared = false;
    note.shareToken = null;
    await note.save();

    res.json({ success: true, message: "Share link revoked" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error closing share link" });
  }
};
