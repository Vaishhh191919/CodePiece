import axios from "axios";
const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";
import Submission from "../models/Submission.model.js";  

export const runCode = async (req, res) => {
const { source_code, language_id, stdin = "", username = "guest", level = 1 } = req.body;

  try {
    const submission = await axios.post(
      `${JUDGE0_URL}/submissions/?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(source_code).toString("base64"),
        language_id,
        stdin: Buffer.from(stdin).toString("base64"),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = submission.data;
    const output = result.stdout || result.stderr || "No Output";
    const success = !result.stderr;

    const newSubmission = new Submission({
      username: "guest",        
      code: source_code,
      language: language_id,
      level: 1,                  
      output,
      success
    });

    await newSubmission.save();

    res.status(200).json(result);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Execution Failed" });
  }
};
