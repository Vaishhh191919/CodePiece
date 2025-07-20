// backend/controllers/runCode.js
import axios from "axios";

export const runCode = async (req, res) => {
  const { source_code, language_id, stdin = "" } = req.body;

  try {
    const submission = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        source_code: Buffer.from(source_code).toString("base64"),
        language_id,
        stdin: Buffer.from(stdin).toString("base64"),
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const { stdout, stderr, compile_output } = submission.data;

    res.json({
      stdout: stdout ? Buffer.from(stdout, "base64").toString() : "",
      stderr: stderr ? Buffer.from(stderr, "base64").toString() : "",
      compile_output: compile_output
        ? Buffer.from(compile_output, "base64").toString()
        : "",
    });
  } catch (err) {
    console.error("Error in runCode:", err);
    res.status(500).json({ error: "Execution failed" });
  }
};
