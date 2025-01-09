import { useState, useEffect, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import contentList from "../content/content-list.json";
import { transitionViewIfSupported } from "../utils";

function Details() {
  const { filename } = useParams();
  const [Content, setContent] = useState(() => () => null);
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if filename has a date prefix
    const dateMatch = filename.match(/^(\d{2})-(\d{2})-(\d{2})_/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      setDate(new Date(`20${year}-${month}-${day}`));
    } else {
      setDate(null);
    }

    // Dynamically import MDX content
    import(`../content/${filename}.mdx`)
      .then((module) => {
        setContent(() => module.default);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading MDX:", err);
        setError("Failed to load content");
      });
  }, [filename]);

  const title = contentList.find((item) => item.name === filename).title;
  console.log(title);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Link
          style={{
            viewTransitionName: title.replaceAll(" ", "").toLowerCase(),
          }}
          to="/"
          className="text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
          onClick={(e) => {
            e.preventDefault();
            transitionViewIfSupported(() => {
              navigate(`/`);
            });
          }}
        >
          ← Back to Overview
        </Link>
        {date && (
          <span className="text-gray-600 text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
