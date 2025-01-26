
import { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import searchIndex from "../content/search-index.json";
import {
  parseDateFromFilename,
  formatDate,
  setDocumentTitle,
  formatTitleFromFilename,
} from "../utils";

function Details() {
  const { filename } = useParams();
  const [Content, setContent] = useState(() => () => null);
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setDate(parseDateFromFilename(filename));
    
    // Extract tags for this file from search index
    const matchedTags = Object.entries(searchIndex)
      .filter(([, files]) => files.includes(filename))
      .map(([tag]) => tag);
    setTags(matchedTags);

    // Dynamically import MDX content
    import(`../content/${filename}.mdx`)
      .then((module) => {
        setContent(() => module.default);
        setError(null);
        const title = formatTitleFromFilename(filename);
        setDocumentTitle(title);
      })
      .catch((err) => {
        console.error("Error loading MDX:", err);
        setError("Failed to load content");
      });

    // Cleanup: reset title when component unmounts
    return () => {
      setDocumentTitle();
    };
  }, [filename]);

  return (
    <>
      <h1
        className="page-title text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100"
        style={{ viewTransitionName: "page-title" }}
      >
        Second Brain
      </h1>
      <hr className="mb-8" />
      <div className="text-gray-800 dark:text-gray-200 flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:flex-1">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mb-4 inline-block"
              viewTransition
            >
              ← Back to Overview
            </Link>
            <div className="flex items-center gap-4">
              {date && (
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatDate(date)}
                </span>
              )}
              <a
                href={`https://github.com/gustavjorlov/secondbrain/blob/main/src/content/${filename}.mdx`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm hover:underline"
              >
                Edit
              </a>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none mt-6">
            <Suspense
              fallback={
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
              }
            >
              {error ? (
                <h1 className="text-red-600 dark:text-red-400">{error}</h1>
              ) : (
                <Content />
              )}
            </Suspense>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="lg:w-64 mb-6 lg:mb-0 order-first lg:order-none">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Post Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/?topic=${tag}`}
                  className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {tag}
                  <span className="ml-1 text-xs">({searchIndex[tag].length})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Details;
