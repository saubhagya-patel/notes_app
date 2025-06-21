import mongoose from "mongoose";


const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "image", "docx"], required: true },

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
