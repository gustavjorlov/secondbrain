import { Link } from "react-router-dom";
import contentList from "../content/content-list.json";

function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Notes</h2>
      <ul className="space-y-2">
        {contentList
          .sort((a, b) => (a.name < b.name ? 1 : -1))
          .map((file) => {
            const dateMatch = file.name.match(/^(\d{2})-(\d{2})-(\d{2})_/);
            let date;
            if (dateMatch) {
              const [, year, month, day] = dateMatch;
              date = new Date(`20${year}-${month}-${day}`);
            } else {
              date = null;
            }
            return (
              <li key={file.name}>
                <Link
                  to={`/${file.name}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {date &&
                    date.toLocaleDateString("se-SE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
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
