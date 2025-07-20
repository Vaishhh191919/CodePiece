import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// route files
import judgeRoutes from "./routes/judge.js";
import submissionRoutes from "./routes/submission.js";
import leetcodeRoutes from "./routes/leetcode.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed!", err));

// Routes
app.use("/api/judge", judgeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leetcode", leetcodeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
