import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { authRoutes, folderRoutes, userRoutes } from "./routes/index.js";
import cookieParser from "cookie-parser"


import { authRoutes, folderRoutes } from "./routes/index.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // React app origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const Mongo_URL = process.env.Mongo_URI
mongoose
  .connect(Mongo_URL)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error("DB error:", err));


import { authMiddleware } from "./middlewares/index.js";


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/folders", folderRoutes)


app.get("/api/test", authMiddleware.protect, (req, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected route!",
    user: req.user, // user info injected by middleware
  });
})