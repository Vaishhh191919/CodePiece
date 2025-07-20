import { useState } from "react";

const QuestionCard = ({ question }) => {
  const [showDesc, setShowDesc] = useState(false); // Hidden by default

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border mb-4">
      {/* Title and Difficulty */}
      <h2 className="text-xl font-semibold text-indigo-700">
        {question.title} <span className="text-sm text-gray-500">({question.difficulty})</span>
      </h2>

      {/* ID */}
      <p className="text-sm text-gray-500 mb-2">
        ID: #{question.questionFrontendId}
      </p>

      {/* Toggle Description */}
      <button
        className="text-sm text-purple-600 underline mb-2"
        onClick={() => setShowDesc((prev) => !prev)}
      >
        {showDesc ? "Hide Description" : "Show Description"}
      </button>

      {/* Rendered HTML description */}
      {showDesc && question.description && (
        <div
          className="prose prose-sm text-gray-800 max-w-none"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
      )}
    </div>
  );
};

export default QuestionCard;
