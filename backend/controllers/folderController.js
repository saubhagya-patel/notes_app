import { Folder, User } from "../models/index.js";


// POST /api/folders
export const createFolder = async (req, res) => {
  const { name, isPrivate } = req.body;

  try {
    const folder = await Folder.create({
      name,
      isPrivate,
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { folders: folder._id },
    });

    res.status(201).json({ success: true, folder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/folders
export const getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).populate("notes");
    console.log(folders)
    res.json({ success: true, folders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// DELETE /api/folders/:id
export const deleteFolder = async (req, res) => {
  const folderId = req.params.id;

  try {
    const folder = await Folder.findOneAndDelete({
      _id: folderId,
      owner: req.user._id,
    });

    if (!folder) return res.status(404).json({ success: false, message: "Folder not found" });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { folders: folderId },
    });

    res.json({ success: true, message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
