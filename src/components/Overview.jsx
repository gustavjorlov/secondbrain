import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Overview() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll hardcode our known markdown files
    // Function to format the title from filename
    const formatTitle = (filename) => {
      // Remove date prefix if it exists (format: YY-MM-DD_)
      const withoutDate = filename.replace(/^\d{2}-\d{2}-\d{2}_/, '');
      // Convert kebab-case to Title Case
      return withoutDate
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const markdownFiles = [
      {
        name: '24-01-08_getting-started',
        title: 'Getting Started',
      },
      {
        name: 'welcome',
        title: 'Welcome',
      },
    ];

    // Sort files alphabetically by title
    const sortedFiles = markdownFiles.sort((a, b) => 
      a.title.localeCompare(b.title)
    );

    setFiles(sortedFiles);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Notes</h2>
      <ul className="space-y-2">
        {files.map((file) => (
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
