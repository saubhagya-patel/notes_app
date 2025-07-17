import mongoose from "mongoose";
import dotenv from "dotenv";
import Folder from "./Folder.js"; // Adjust path as needed
import User from "./User.js";     // Required to set folder.owner

dotenv.config();

const MONGO_URI = "mongodb://localhost:27017/notes-manager";
console.log(MONGO_URI)

// Sample core folders
const coreFolders = [
  {
    name: "Data Structures and Algorithms",
    description: "Core DSA folder for all semesters.",
  },
  {
    name: "Operating Systems",
    description: "Core OS concepts and notes.",
  },
  {
    name: "Database Management Systems",
    description: "DBMS notes and question banks.",
  },
  {
    name: "Computer Networks",
    description: "CN notes including OSI, TCP/IP, etc.",
  },
  {
    name: "Software Engineering",
    description: "Theory and practices in SE.",
  },
];

async function seedCoreFolders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 👇 Replace this with a valid user from your DB
    const defaultUser = await User.findOne({ email: "md.mansoori.ug22@nsut.ac.in" });

    if (!defaultUser) {
      throw new Error("⚠️ No default user found. Please create one first.");
    }

    // Avoid inserting duplicates
    const existing = await Folder.find({ isCoreFolder: true });
    if (existing.length > 0) {
      console.log("ℹ️ Core folders already exist. Skipping insertion.");
      return;
    }

    const foldersWithOwner = coreFolders.map((folder) => ({
      ...folder,
      isCoreFolder: true,
      isPrivate: false,
      owner: defaultUser._id,
    }));

    await Folder.insertMany(foldersWithOwner);
    console.log("✅ Core folders added successfully.");
  } catch (err) {
    console.error("❌ Failed to insert core folders:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedCoreFolders();

