import axios from "axios";
const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";

export const runCode = async (req, res) => {
  const { source_code, language_id, stdin = "" } = req.body;

  try {
    const submission = await axios.post(
      `${JUDGE0_URL}/submissions/?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(source_code).toString("base64"),
        language_id,
        stdin: Buffer.from(stdin).toString("base64"),
      }
    );

    res.status(200).json({
      stdout: Buffer.from(submission.data.stdout || "", "base64").toString(),
      stderr: Buffer.from(submission.data.stderr || "", "base64").toString(),
      compile_output: Buffer.from(submission.data.compile_output || "", "base64").toString(),
      time: submission.data.time,
      memory: submission.data.memory,
      status: submission.data.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code execution failed" });
  }
};
