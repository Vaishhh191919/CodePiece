import { useEffect, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";

// Language mapping for Judge0 API
const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54,
};

// Default boilerplate for each language
const DEFAULT_CODES = {
  javascript: (funcName) =>
    `function ${funcName}(input) {\n  // Type your code here\n}`,
  python: (funcName) =>
    `def ${funcName}(input):\n    # Type your code here\n    pass`,
  cpp: (funcName) =>
    `#include<iostream>\nusing namespace std;\n\nint ${funcName}(int input) {\n    // Type your code here\n    return 0;\n}`,
};

const Level5 = () => {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Type your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [testCase, setTestCase] = useState("");
  const hasFetched = useRef(false);

  const toFunctionName = (title) => {
    if (!title) return "solution";
    try {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word, idx) =>
          idx === 0 ? word : word[0].toUpperCase() + word.slice(1)
        )
        .join("");
    } catch {
      return "solution";
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("http://localhost:5000/api/leetcode?difficulty=Hard")
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        const funcName = toFunctionName(data.title);
        const defaultTestCase = data.examples?.[0]?.input || '"No Output"';
        setTestCase(defaultTestCase);
        setCode(DEFAULT_CODES[language](funcName));
      })
      .catch((err) => {
        console.error("Error fetching question", err);
        setStatus("Failed to load question. Please try again.");
      });
  }, [language]);

  const runCode = async () => {
    const funcName = toFunctionName(question?.title || "solution");

    let fullCode = "";
    if (language === "javascript") {
      fullCode = `${code}\nconsole.log(${funcName}(${testCase}))`;
    } else if (language === "python") {
      fullCode = `${code}\nprint(${funcName}(${testCase}))`;
    } else if (language === "cpp") {
      fullCode = `${code}\n\nint main() {\n    cout << ${funcName}(${testCase});\n    return 0;\n}`;
    }

    try {
      const response = await fetch("http://localhost:5000/api/judge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: fullCode,
          language_id: LANGUAGE_MAP[language],
        }),
      });

      const data = await response.json();
      const result = data?.stdout?.trim() || data?.stderr?.trim() || "No Output";

      setOutput(result);
      const expectedOutput = question?.examples?.[0]?.output;

      if (expectedOutput && result === String(expectedOutput)) {
        setStatus("✅ Correct! You've cleared Level 5!");
        localStorage.setItem("level5_cleared", "true");
      } else {
        setStatus("❌ Output doesn't match expected result. Try again.");
      }
    } catch (err) {
      setOutput(`🚨 Error: ${err.message}`);
      setStatus("❌ There was an error executing your code.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-700">
        🧠 Level 5: Solve a <span className="text-purple-700">Hard</span> LeetCode-style Problem
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Choose Language:</label>
        <select
          value={language}
          onChange={(e) => {
            const lang = e.target.value;
            setLanguage(lang);
            if (question) {
              const funcName = toFunctionName(question.title);
              setCode(DEFAULT_CODES[lang](funcName));
            }
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {question ? (
        <>
          <QuestionCard question={question} />
          <div className="mt-6">
            <CodeEditor code={code} setCode={setCode} />
          </div>
          <button
            onClick={runCode}
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            ▶ Run Code
          </button>
          <OutputBox output={output} />
          {status && <p className="mt-3 font-semibold">{status}</p>}
        </>
      ) : (
        <p>🕐 Loading Hard question...</p>
      )}
    </div>
  );
};

export default Level5;
