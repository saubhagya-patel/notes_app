import mongoose from "mongoose";


const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPrivate: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Folder", folderSchema);