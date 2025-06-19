import mongoose from "mongoose";


const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // TODO: we can probably use gpt here to generate a description based on the folder name, sem, files etc.
    description: { type: String, default: "" },
    isPrivate: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

folderSchema.index({ owner: 1 });


export default mongoose.model("Folder", folderSchema);
