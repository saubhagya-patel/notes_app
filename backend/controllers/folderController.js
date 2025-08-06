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
    console.log(err)
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
  // Destructure all relevant fields from the request body sent by the frontend
  const { name, subject, semester, isCoreFolder, parent, isPrivate } = req.body;
  const ownerId = req.user._id;

  // Basic validation
  if (!name || !subject || !semester) {
    return res.status(400).json({ success: false, message: "Name, subject, and semester are required." });
  }

  try {
    // Create the new folder with all the fields from the frontend
    const newFolder = await Folder.create({
      name,
      subject,
      semester,
      isCoreFolder: isCoreFolder || false, // Default to false if not provided
      isPrivate: isPrivate === undefined ? true : isPrivate, // Default to true if not provided
      owner: ownerId,
      parent: parent || null, // Use 'parent' from the payload
    });

    // Add the new folder's ID to the user's list of folders
    await User.findByIdAndUpdate(ownerId, {
      $push: { folders: newFolder._id },
    });

    // If it's a subfolder, add its ID to the parent folder's 'subfolders' array
    if (parent) {
      const parentFolder = await Folder.findById(parent);

      // Check if parent folder exists and if the current user is the owner
      if (!parentFolder || !parentFolder.owner.equals(ownerId)) {
        // It's good practice to roll back the folder creation if the parent is invalid,
        // but for simplicity, we'll just return an error here.
        return res.status(403).json({ success: false, message: "Invalid or unauthorized parent folder" });
      }

      parentFolder.subfolders.push(newFolder._id);
      await parentFolder.save();
    }

    // Respond with success and the newly created folder data
    res.status(201).json({ success: true, folder: newFolder });
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};


// GET /api/folders/all
export const getAllPublicFolders = async (req, res) => {
  try {
    // Find all folders where 'isPrivate' is false.
    // We can also populate some fields to provide more context on the frontend.
    const publicFolders = await Folder.find({ isPrivate: false })
      .populate("owner", "name") // Populate the owner's name
      .populate("notes") // Populate the notes within the folder
      .sort({ createdAt: -1 }); // Sort by most recently created

    res.status(200).json({
      success: true,
      count: publicFolders.length,
      data: publicFolders,
    });
  } catch (err) {
    console.error("Error fetching public folders:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// GET /api/folders
export const getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).populate("notes");
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
