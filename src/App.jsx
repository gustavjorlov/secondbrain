import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import Overview from "./components/Overview";
import Details from "./components/Details";

// MDX components configuration
const components = {
  // Add any custom components or styling you want available in MDX files
  h1: (props) => (
    <h1
      className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 text-gray-800 dark:text-gray-200" {...props} />
  ),
  a: (props) => (
    <a
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside mb-4 text-gray-800 dark:text-gray-200"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside mb-4 text-gray-800 dark:text-gray-200"
      {...props}
    />
  ),
  li: (props) => <li className="mb-1" {...props} />,
  pre: (props) => (
    <pre
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4"
      {...props}
    />
  ),
};

function App() {
  return (
    <>
      <MDXProvider components={components}>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-5xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                Second Brain
              </h1>
              <hr className="mb-8" />
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/:filename" element={<Details />} />
              </Routes>
            </div>
          </div>
        </Router>
      </MDXProvider>
    </>
  );
}

export default App;
