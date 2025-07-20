// models/Submission.model.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    level: { type: Number, required: true },
    questionId: { type: String },
    code: { type: String, required: true },
    language: { type: String, required: true },
    output: { type: String },
    expectedOutput: { type: String },
    status: {
      type: String,
      enum: ["pass", "fail", "error"],
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
