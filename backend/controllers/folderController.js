import { Folder, User } from "../models/index.js";


// to get CORE subject folders
export const getSubjectFolders = async (req, res) => {
  try {
    const userSubjects = req.user.subjects; // assuming stored as array in user
    // console.log(userSubjects)

    if (!userSubjects || !Array.isArray(userSubjects)) {
      return res.status(400).json({ success: false, message: "User subjects not defined." });
    }

    const folders = await Folder.find({
      isCoreFolder: true,
      name: { $in: userSubjects },
    });

    res.json({ success: true, folders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subject folders" });
  }
};

// get folder notes

export const getFolder = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId)
      .populate({
        path: "notes",
        select: "title fileUrl fileType vote createdAt",
      })
      .populate({
        path: "owner",
        select: "name email _id",
      })
      .populate({
        path: "subfolders",
        select: "name subject isPrivate createdAt",
      })
      .lean();

    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    res.json({ success: true, folder });
  } catch (err) {
    console.error("Error fetching folder:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/folders
export const createFolder = async (req, res) => {
  const { name, isPrivate, parentFolderId } = req.body;

  try {
    // Create the new folder
    const newFolder = await Folder.create({
      name,
      isPrivate,
      owner: req.user._id,
      parent: parentFolderId || null,
    });

    // Add folder to user's folders list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { folders: newFolder._id },
    });

    // If it's a subfolder, add to parent folder's subfolders list
    console.log(parentFolderId)
    if (parentFolderId) {
      const parentFolder = await Folder.findById(parentFolderId);

      if (!parentFolder || !parentFolder.owner.equals(req.user._id)) {
        return res.status(403).json({ success: false, message: "Invalid or unauthorized parent folder" });
      }

      parentFolder.subfolders.push(newFolder._id);
      await parentFolder.save();
    }

    res.status(201).json({ success: true, folder: newFolder });
  } catch (err) {
    console.log(err);
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
