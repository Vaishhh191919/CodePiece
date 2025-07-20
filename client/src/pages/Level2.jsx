import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import RunButton from "../components/RunButton";
import OutputBox from "../components/OutputBox";
import { useNavigate } from "react-router-dom";

const languageOptions = {
  javascript: 63,
  python: 71,
  cpp: 54,
};

const defaultCodeByLanguage = {
  javascript: `function greet(name) {
  return "Hello, " + name + "!";
}`,
  python: `def greet(name):
  return "Hello, " + name`,
  cpp: `#include <iostream>
using namespace std;

string greet(string name) {
  return "Hello, " + name + "!";
}`,
};

const expectedOutputByLanguage = {
  javascript: "Hello, Alice!",
  python: "Hello, Alice!",
  cpp: "Hello, Alice!",
};

const Level2 = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCodeByLanguage["javascript"]);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");

  const runCode = async () => {
    let fullCode;
    if (language === "javascript") {
      fullCode = `${code}\nconsole.log(greet("Alice"));`;
    } else if (language === "python") {
      fullCode = `${code}\nprint(greet("Alice"))`;
    } else if (language === "cpp") {
      fullCode = `${code}
int main() {
  cout << greet("Alice") << endl;
  return 0;
}`;
    }

    try {
      const response = await fetch("http://localhost:5000/api/judge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: fullCode,
          language_id: languageOptions[language],
        }),
      });

      const data = await response.json();
      const userOutput =
        data?.stdout?.trim() || data?.stderr?.trim() || "No Output";

      setOutput(userOutput);

      if (userOutput === expectedOutputByLanguage[language]) {
        setStatus("✅ Correct! You've cleared Level 2.");
        localStorage.setItem("level2_cleared", "true");
      } else {
        setStatus("❌ Incorrect output. Try again.");
      }
    } catch (err) {
      console.error("Judge0 error:", err);
      setStatus("🚨 Error executing code");
      setOutput("No output");
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(defaultCodeByLanguage[selectedLang]);
    setOutput("");
    setStatus("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🧪 Level 2: Greeting Challenge</h1>
      <p className="mb-2 text-gray-700">
        Fix the function so that <code>greet("Alice")</code> returns <strong>Hello, Alice!</strong>
      </p>

      <div className="mb-4">
        <label className="font-semibold text-gray-800 mr-2">Language:</label>
        <select
          className="px-2 py-1 border rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <CodeEditor code={code} setCode={setCode} language={language} />
      <RunButton onRun={runCode} />
      <OutputBox output={output} />

      {status && <p className="mt-4 font-semibold text-lg">{status}</p>}

      {status.includes("✅") && (
        <button
          onClick={() => navigate("/level3")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➡️ Go to Level 3
        </button>
      )}
    </div>
  );
};

export default Level2;

