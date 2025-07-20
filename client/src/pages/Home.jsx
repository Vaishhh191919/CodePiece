import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState({
    level1: true,
    level2: false,
    level3: false,
    level4: false,
    level5: false,
  });

  useEffect(() => {
    const level1 = localStorage.getItem("level1_cleared") === "true";
    const level2 = level1 && localStorage.getItem("level2_cleared") === "true";
    const level3 = level2 && localStorage.getItem("level3_cleared") === "true";
    const level4 = level3 && localStorage.getItem("level4_cleared") === "true";

    setUnlocked({
      level1: true,
      level2: level1,
      level3: level2,
      level4: level3,
      level5: level4,
    });
  }, []);

  const renderButton = (level, index) => {
    const levelKey = `level${index + 1}`;
    const isUnlocked = unlocked[levelKey];
    return (
      <button
        key={levelKey}
        onClick={() => isUnlocked && navigate(`/level/${index + 1}`)}
        className={`w-full text-left p-4 rounded-lg shadow-md transition mb-4 ${
          isUnlocked
            ? "bg-blue-100 hover:bg-blue-200 cursor-pointer"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isUnlocked}
      >
        {level}
        {!isUnlocked && <span className="ml-2 text-sm">🔒 Locked</span>}
      </button>
    );
  };

  const levels = [
    "🎯 Level 1: Basics",
    "🧠 Level 2: Easy Challenge",
    "⚔️ Level 3: Medium Challenge",
    "🔥 Level 4: Tricky Medium",
    "👑 Level 5: Hardest One",
  ];

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        🧩 CodePiece Levels
      </h1>
      {levels.map((label, idx) => renderButton(label, idx))}
    </div>
  );
};

export default Home;
