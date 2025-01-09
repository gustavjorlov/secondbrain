import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import Overview from "./components/Overview";
import Details from "./components/Details";

// MDX components configuration
const components = {
  // Add any custom components or styling you want available in MDX files
  h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-bold mb-3" {...props} />,
  h3: (props) => <h3 className="text-xl font-bold mb-2" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  a: (props) => (
    <a
      className="text-blue-600 hover:text-blue-800 hover:underline"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  pre: (props) => <pre {...props} />,
};

function App() {
  return (
    <>
      <h1>...</h1>
      <MDXProvider components={components}>
        <Router basename={import.meta.env.PROD ? "/secondbrain" : "/"}>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Second Brain</h1>
            <Routes>
              <Route element={<h1>Nothing</h1>} />
              <Route path="/" element={<Overview />} />
              <Route path="/:filename" element={<Details />} />
            </Routes>
          </div>
        </Router>
      </MDXProvider>
    </>
  );
}

export default App;
