
import { useState } from "react";

const Level1 = () => {
  const [userOutput, setUserOutput] = useState("");
  const [status, setStatus] = useState("");

  const snippet = `let a = [1, 2, 3];
let b = a;
b.push(4);
console.log(a);`;

  const correctOutput = "[1,2,3,4]";

  const checkAnswer = () => {
    if (userOutput.replace(/\s/g, "") === correctOutput) {
      setStatus("✅ Correct! You've unlocked Level 2!");
      localStorage.setItem("level1_cleared", "true");
    } else {
      setStatus("❌ Incorrect. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">🧠 Level 1: Guess the Output</h1>
      <pre className="bg-gray-900 text-green-300 p-4 rounded-md shadow mb-4">
        <code>{snippet}</code>
      </pre>
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Enter the output..."
        value={userOutput}
        onChange={(e) => setUserOutput(e.target.value)}
      />
      <button
        onClick={checkAnswer}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ✅ Submit Answer
      </button>
      {status && <p className="mt-3 font-semibold">{status}</p>}
    </div>
  );
};

export default Level1;