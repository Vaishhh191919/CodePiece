import { useEffect, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

const Level4 = () => {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Type your code here");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [testCase, setTestCase] = useState("");
  const [language, setLanguage] = useState("javascript");

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

    fetch("http://localhost:5000/api/leetcode?difficulty=Medium")
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        const funcName = toFunctionName(data.title);
        const defaultTestCase = data.examples?.[0]?.input || '"No Output"';
        setTestCase(defaultTestCase);
        setCode(`function ${funcName}(input) {\n  // Type your code here\n}`);
      })
      .catch((err) => {
        console.error("Error fetching question", err);
        setStatus("Failed to load question. Please try again.");
      });
  }, []);

  const runCode = async () => {
    try {
      const funcName = toFunctionName(question?.title || "solution");
      const selectedLanguageId = languageMap[language];

      let wrappedCode = "";
      if (language === "javascript") {
        wrappedCode = `${code}\nconsole.log(${funcName}(${testCase}));`;
      } else if (language === "python") {
        wrappedCode = `
${code}
print(${funcName}(${testCase}))
        `;
      } else if (language === "cpp") {
        wrappedCode = `
#include <iostream>
using namespace std;

${code}

int main() {
    cout << ${funcName}(${testCase});
    return 0;
}
        `;
      } else if (language === "java") {
        wrappedCode = `
public class Main {
  ${code}

  public static void main(String[] args) {
    System.out.println(${funcName}(${testCase}));
  }
}
        `;
      }

      const response = await fetch("http://localhost:5000/api/judge/run", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    source_code: fullCode,
    language_id: LANGUAGE_MAP[language],
    level: 5,
    language,
    expectedOutput: question?.examples?.[0]?.output,
    username: "vaishnavi" 
  }),
});


      const data = await response.json();
      const userOutput =
        data?.stdout?.trim() || data?.stderr?.trim() || "No Output";
      setOutput(userOutput);

      const expectedOutput = question?.examples?.[0]?.output;
      const cleanOutput =
        typeof expectedOutput === "object"
          ? JSON.stringify(expectedOutput)
          : String(expectedOutput);

      if (cleanOutput === userOutput) {
        setStatus("✅ Correct! You've cleared Level 4!");
        localStorage.setItem("level4_cleared", "true");
      } else {
        setStatus("❌ Output doesn't match expected result. Try again.");
      }
    } catch (err) {
      setOutput(`🚨 Error: ${err.message}`);
      setStatus("❌ There was an error in your code.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">
        🧠 Level 4: Solve a <span className="text-orange-600">Medium</span> LeetCode-style Problem
      </h1>

      {question ? (
        <>
          <QuestionCard question={question} />

          <div className="mt-4">
            <label className="mr-2 text-sm font-semibold text-gray-600">Select Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-2 py-1 rounded bg-white text-gray-800"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="mt-6">
            <CodeEditor code={code} setCode={setCode} />
          </div>

          <button
            onClick={runCode}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ▶ Run Code
          </button>

          <OutputBox output={output} />
          {status && <p className="mt-3 font-semibold">{status}</p>}
        </>
      ) : (
        <p>🕐 Loading Medium question...</p>
      )}
    </div>
  );
};

export default Level4;
