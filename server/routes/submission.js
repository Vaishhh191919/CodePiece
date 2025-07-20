import express from "express";
import Submission from "../models/Submission.model.js";

const router = express.Router();

router.get("/user/:username", async (req, res) => {
  try {
    const submissions = await Submission.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.log("Error fetching submissions", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
