# SecondBrain Documentation Site

A personal knowledge base built with React, Vite, and MDX.

## Adding New Content

### File Structure
Content is stored as MDX files in the `src/content` directory. Files should follow this naming convention:
```
YY-MM-DD_title.mdx
```
For example: `25-01-16_graphql-federation.mdx`

### Workflow
1. Create a new MDX file in `src/content` following the naming convention
2. Write your content using MDX (Markdown with JSX support)
3. Run the development server to preview your changes:
   ```bash
   npm run dev
   ```
4. Commit and push your changes to trigger the build and deployment

### Content Guidelines
- Use descriptive titles in the filename (kebab-case)
- Include relevant code examples using markdown code blocks
- Group related content with consistent terminology for better search results
- Avoid including sensitive or private information

## Technical Architecture

### Core Technologies
- **React + Vite**: Frontend framework and build tool
- **MDX**: Markdown with JSX support for rich content
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing

### Build Process
The build process consists of several steps:

1. **Content Indexing**
   - `generate-content-list.js`: Creates a JSON index of all MDX files
   - `generate-search-index.js`: Builds a searchable index using natural language processing
   
2. **Asset Building**
   - Vite bundles and optimizes all assets
   - MDX files are processed and converted to React components

### Search Functionality
The site includes a full-text search feature that:
- Removes common programming terms and stop words
- Indexes significant words across all content
- Provides quick access to relevant documents

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

The site is configured to deploy to the `/secondbrain/` path in production. This is set in `vite.config.js`:

```js
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/secondbrain/' : '/',
  // ...
}))
```

When you push changes to the repository:
1. The content indices are automatically regenerated during the build process
2. All MDX files are compiled and bundled with the application
3. The site is deployed and accessible at the configured base path
