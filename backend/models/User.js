// models/User.js
import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    semester: {
      type: Number,
      min: 1,
      max: 10, // assuming max 10 semesters
      default: 1,
    },

    subjects: [
      {
        type: String,
      },
    ],

    institution: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],

    sharedNotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
