import axios from "axios";

const RunButton = ({ code, input, setOutput, languageId }) => {
  const handleRun = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/judge/run", {
        source_code: code,
        language_id: languageId,
        stdin: input,
      });

      const { stdout, stderr, compile_output } = response.data;
      setOutput(stdout || stderr || compile_output || "No output");
    } catch (error) {
      console.error("Execution failed:", error);
      setOutput("Error executing code");
    }
  };

  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      onClick={handleRun}
    >
      ▶️ Run
    </button>
  );
};

export default RunButton;
