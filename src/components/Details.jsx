import { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { parseDateFromFilename, formatDate, setDocumentTitle, formatTitleFromFilename } from "../utils";

function Details() {
  const { filename } = useParams();
  const [Content, setContent] = useState(() => () => null);
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDate(parseDateFromFilename(filename));

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
    <div className="text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mb-4 inline-block"
          viewTransition
        >
          ← Back to Overview
        </Link>
        {date && (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {formatDate(date)}
          </span>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none mt-6">
        <Suspense fallback={<div className="text-gray-600 dark:text-gray-400">Loading...</div>}>
          {error ? <h1 className="text-red-600 dark:text-red-400">{error}</h1> : <Content />}
        </Suspense>
      </div>
    </div>
  );
}

export default Details;
