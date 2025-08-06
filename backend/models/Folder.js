import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // TODO: we can probably use gpt here to generate a description based on the folder name, sem, files etc.
    description: { type: String, default: "" },
    // If you update the semester update it in Note modal also.
    semester: {
      type: Number,
      min: 1,
      max: 10, // assuming max 10 semesters
      default: 1,
    },
    subject: { type: String, default: "" },
    isPrivate: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCoreFolder: { type: Boolean, default: false },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    subfolders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  { timestamps: true }
);

// Indexing the owner for faster queries related to a specific user.
folderSchema.index({ owner: 1 });

// You might also consider adding an index for semester and subject if you plan to query by them frequently.
// folderSchema.index({ owner: 1, semester: 1, subject: 1 });

export default mongoose.model("Folder", folderSchema);
