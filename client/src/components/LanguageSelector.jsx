// src/components/LanguageSelector.jsx
const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  const languages = [
    { id: 54, name: "C++" },
    { id: 62, name: "Java" },
    { id: 71, name: "Python 3" },
    { id: 63, name: "JavaScript" },
  ];

  return (
    <div className="mb-2">
      <label className="font-semibold mr-2">Language:</label>
      <select
        className="border px-2 py-1 rounded"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
