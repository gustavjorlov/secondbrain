import { Link } from 'react-router-dom';
import contentList from '../content/content-list.json';

function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Notes</h2>
      <ul className="space-y-2">
        {contentList.map((file) => (
          <li key={file.name}>
            <Link
              to={`/${file.name}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {file.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Overview;
