import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import contentList from "../content/content-list.json";
import searchIndex from "../content/search-index.json";
import { parseDateFromFilename, formatDate, setDocumentTitle } from "../utils";
import Search from "./Search";

function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedWord = searchParams.get("topic");

  useEffect(() => {
    setDocumentTitle();
  }, []);

  const handleWordSelect = (word) => {
    setSearchParams(word ? { topic: word } : {});
  };

  const filteredFiles =
    selectedWord && searchIndex[selectedWord]
      ? contentList.filter((file) =>
          searchIndex[selectedWord].includes(file.name)
        )
      : contentList;

  return (
    <>
      <h1
        className="page-title text-5xl font-bold mb-8 text-gray-900 dark:text-gray-100"
        style={{ viewTransitionName: "page-title" }}
      >
        Second Brain
      </h1>
      <hr className="mb-8" />
      <div className="text-gray-800 dark:text-gray-200 flex flex-col lg:flex-row lg:gap-8">
        <ul className="space-y-2 lg:flex-1 order-first lg:order-none mb-10">
          <li className="mb-4">
            <a
              href="https://github.com/gustavjorlov/secondbrain/tree/main/src/content"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm hover:underline"
            >
              + Create new
            </a>
          </li>
          {filteredFiles
            .sort((a, b) => (a.name < b.name ? 1 : -1))
            .map((file) => {
              const date = parseDateFromFilename(file.name);
              return (
                <li key={file.name}>
                  <Link
                    to={`/${file.name}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover-glow"
                    viewTransition
                  >
                    {date &&
                      formatDate(date, "sv-SE", {
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
        <div className="flex flex-col gap-8">
          <Search
            selectedWord={selectedWord}
            onWordSelect={handleWordSelect}
            onClear={() => handleWordSelect(null)}
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Links from Posts</h2>
            <ul className="space-y-2">
              {Array.from(
                new Set(
                  contentList
                    .flatMap((file) => file.links || [])
                    .map((link) => JSON.stringify(link))
                )
              )
                .map((linkStr) => JSON.parse(linkStr))
                .map((link, index) => {
                  const text = link.text.toLowerCase();
                  let prefix = "";
                  if (text.startsWith("video") || text.includes("youtube")) {
                    prefix = "📺 ";
                  } else if (text.startsWith("article")) {
                    prefix = "🖌️ ";
                  } else if (
                    text.startsWith("docs") ||
                    text.startsWith("documentation")
                  ) {
                    prefix = "📚 ";
                  }
                  return (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover-glow"
                      >
                        {prefix}
                        {link.text}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Overview;
