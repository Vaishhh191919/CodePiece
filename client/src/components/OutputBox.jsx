const OutputBox = ({ output }) => {
  return (
    <div className="mt-4 bg-gray-100 p-3 rounded border font-mono">
      <strong>Output:</strong>
      <pre>{output}</pre>
    </div>
  );
};

export default OutputBox;
