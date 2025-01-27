
import { useState, useEffect, Suspense, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import searchIndex from "../content/search-index.json";
import contentList from "../content/content-list.json";
import {
  parseDateFromFilename,
  formatDate,
  setDocumentTitle,
  formatTitleFromFilename,
  calculateReadingTime,
} from "../utils";

function Details() {
  const { filename } = useParams();
  const [Content, setContent] = useState(() => () => null);
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = (window.scrollY / scrollHeight) * 100;
    setScrollProgress(currentProgress);
  }, []);

  useEffect(() => {
    setDate(parseDateFromFilename(filename));
    
    // Get content metadata including word count
    const fileMetadata = contentList.find(item => item.name === filename);
    setMetadata(fileMetadata);
    
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

    // Add scroll event listener
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial calculation

    // Cleanup: reset title and remove scroll listener when component unmounts
    return () => {
      setDocumentTitle();
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, [filename, updateScrollProgress]);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3px',
          backgroundColor: '#3b82f6', // blue-500 to match the link color
          transition: 'width 0.1s',
          zIndex: 50
        }}
      />
      <h1
        className="page-title text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100"
        style={{ viewTransitionName: "page-title" }}
      >
        Second Brain
      </h1>
      <hr className="mb-8" />
      <div className="text-gray-800 dark:text-gray-200 flex flex-col lg:flex-row lg:gap-8">
        <div className="lg:flex-1 mb-8">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline mb-4 inline-block"
              viewTransition
            >
              ← Back to Overview
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {date && <span>{formatDate(date)}</span>}
                {metadata && (
                  <span className="ml-3">· {calculateReadingTime(metadata.wordCount)} read</span>
                )}
              </div>
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
          <div className="lg:w-64">
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
