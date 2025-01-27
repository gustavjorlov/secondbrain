import searchIndex from "../content/search-index.json";
import PropTypes from "prop-types";
import { useState } from "react";

function Search({ onWordSelect, selectedWord, onClear }) {
  const [showAll, setShowAll] = useState(false);
  const allWords = Object.keys(searchIndex).sort(
    (a, b) => searchIndex[b].length - searchIndex[a].length
  );
  const displayedWords = showAll ? allWords : allWords.slice(0, 25);

  return (
    <div className="lg:w-64 mb-6 lg:mb-0">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Popular Topics
        </h2>
        {selectedWord && (
          <button
            onClick={onClear}
            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-1">
        <div className="flex flex-wrap gap-2 mb-2 transition-all duration-500 ease-in-out">
          {displayedWords.map((word) => (
            <button
              key={word}
              onClick={() => onWordSelect(word)}
              className={`px-3 py-1 rounded-full text-sm transition-colors text-left animate-fadeSlideIn opacity-0 ${
                selectedWord === word
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {word}
              <span className="ml-1 text-xs">({searchIndex[word].length})</span>
            </button>
          ))}
        </div>
      </div>
      {!showAll && allWords.length > 25 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-2"
        >
          Show {allWords.length - 25} more topics...
        </button>
      )}
    </div>
  );
}

Search.propTypes = {
  onWordSelect: PropTypes.func.isRequired,
  selectedWord: PropTypes.string,
  onClear: PropTypes.func.isRequired,
};

export default Search;
