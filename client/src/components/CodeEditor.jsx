const CodeEditor = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-64 border p-3 font-mono rounded mt-4"
    />
  );
};

export default CodeEditor;
