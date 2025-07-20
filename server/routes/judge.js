import express from "express";
import axios from "axios";
import Submission from "../models/Submission.js"; // <-- import model

const router = express.Router();

router.post("/run", async (req, res) => {
  const { source_code, language_id, level, language, expectedOutput, username = "guest" } = req.body;

  try {
    const response = await axios.post("http://localhost:2358/submissions/?base64_encoded=false&wait=true", {
      source_code,
      language_id
    });

    const { stdout, stderr } = response.data;
    const output = stdout?.trim() || stderr?.trim() || "No Output";

    // Save to MongoDB
    await Submission.create({
      username,
      level,
      code: source_code,
      language,
      output,
      expectedOutput,
      status: output === expectedOutput ? "pass" : "fail"
    });

    res.json({ stdout: output });
  } catch (err) {
    console.error("Judge0 error:", err.message);

    // Save failed submission
    await Submission.create({
      username,
      level,
      code: source_code,
      language,
      output: err.message,
      expectedOutput,
      status: "error"
    });

    res.status(500).json({ error: "Code execution failed" });
  }
});

export default router;
