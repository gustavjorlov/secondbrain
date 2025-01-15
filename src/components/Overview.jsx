import { Link } from "react-router-dom";
import { useEffect } from "react";
import contentList from "../content/content-list.json";
import { parseDateFromFilename, formatDate, setDocumentTitle } from "../utils";

function Overview() {
  useEffect(() => {
    setDocumentTitle();
  }, []);

  return (
    <div>
      <ul className="space-y-2">
        {contentList
          .sort((a, b) => (a.name < b.name ? 1 : -1))
          .map((file) => {
            const date = parseDateFromFilename(file.name);
            return (
              <li key={file.name}>
                <Link
                  to={`/${file.name}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
    </div>
  );
}

export default Overview;
