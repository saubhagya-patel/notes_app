import mongoose from "mongoose";


export const ALLOWED_FILE_TYPES = ["pdf", "png", "jpg", "jpeg", "docx", "pptx", "txt"]


const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ALLOWED_FILE_TYPES, required: true },

    vote: { type: Number, default: 0 },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },

    isShared: { type: Boolean, default: false },
    shareToken: { type: String, default: null },
  },
  { timestamps: true }
);

noteSchema.index({ owner: 1 });
noteSchema.index({ folder: 1 });


export default mongoose.model("Note", noteSchema);
