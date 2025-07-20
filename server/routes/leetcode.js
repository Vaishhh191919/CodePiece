import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/leetcode?difficulty=Easy|Medium|Hard
router.get("/", async (req, res) => {
  const difficulty = req.query.difficulty || "Easy";

  try {
    // Step 1: Fetch all problems from public LeetCode API
    const listResponse = await axios.get("https://leetcode.com/api/problems/all/");
    const problems = listResponse.data.stat_status_pairs;

    // Step 2: Filter by difficulty
    const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };
    const level = difficultyMap[difficulty] || 1;

    const filtered = problems.filter(
      (q) => q.difficulty.level === level && !q.paid_only
    );

    if (filtered.length === 0) {
      return res.status(404).json({ error: "No questions found." });
    }

    // Step 3: Pick a random question
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const slug = random.stat.question__title_slug;

    // Step 4: Fetch description using GraphQL
    const DESC_QUERY = `
      query {
        question(titleSlug: "${slug}") {
          content
        }
      }
    `;

    const descResponse = await axios.post(
      "https://leetcode.com/graphql",
      { query: DESC_QUERY },
      { headers: { "Content-Type": "application/json" } }
    );

    const description = descResponse.data?.data?.question?.content || "Description unavailable.";

    // Step 5: Respond with full data
    res.json({
      title: random.stat.question__title,
      questionFrontendId: random.stat.frontend_question_id,
      difficulty: difficulty,
      titleSlug: slug,
      description,
    });

  } catch (err) {
    console.error("❌ LeetCode API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch question." });
  }
});

export default router;