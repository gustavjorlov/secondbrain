import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import contentList from "../content/content-list.json";
import searchIndex from "../content/search-index.json";
import { parseDateFromFilename, formatDate, setDocumentTitle } from "../utils";
import Search from "./Search";

function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedWord = searchParams.get('topic');

  useEffect(() => {
    setDocumentTitle();
  }, []);

  const handleWordSelect = (word) => {
    setSearchParams(word ? { topic: word } : {});
  };

  const filteredFiles = selectedWord && searchIndex[selectedWord]
    ? contentList.filter(file => searchIndex[selectedWord].includes(file.name))
    : contentList;

  return (
    <div className="text-gray-800 dark:text-gray-200 flex flex-col lg:flex-row lg:gap-8">
      <ul className="space-y-2 lg:flex-1 order-first lg:order-none mb-10">
        {filteredFiles
          .sort((a, b) => (a.name < b.name ? 1 : -1))
          .map((file) => {
            const date = parseDateFromFilename(file.name);
            return (
              <li key={file.name}>
                <Link
                  to={`/${file.name}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  viewTransition
                >
                  {date && formatDate(date, "sv-SE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" :: "}
                  {file.title}
                </Link>
              </li>
            );
          })}
      </ul>
      <Search
        selectedWord={selectedWord}
        onWordSelect={handleWordSelect}
        onClear={() => handleWordSelect(null)}
      />
    </div>
  );
}

export default Overview;
