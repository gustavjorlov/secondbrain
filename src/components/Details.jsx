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
    <div>
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
          viewTransition
        >
          ← Back to Overview
        </Link>
        {date && (
          <span className="text-gray-600 text-sm">
            {formatDate(date)}
          </span>
        )}
      </div>
      <div className="prose max-w-none mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          {error ? <h1>{error}</h1> : <Content />}
        </Suspense>
      </div>
    </div>
  );
}

export default Details;
