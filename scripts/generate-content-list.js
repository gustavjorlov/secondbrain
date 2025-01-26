import fs from 'fs/promises';
import path from 'path';
import process from 'process';

function countWords(content) {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

async function extractLinks(content) {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2]
    });
  }

  return links;
}

async function generateContentList() {
  try {
    const contentDir = path.join(process.cwd(), 'src', 'content');
    const files = await fs.readdir(contentDir);
    
    const mdxFiles = (
      await Promise.all(
        files
          .filter(file => file.endsWith('.mdx'))
          .map(async file => {
            const name = file.replace('.mdx', '');
            // Convert kebab-case to Title Case, but handle date prefix specially
            const title = name
              .replace(/^\d{2}-\d{2}-\d{2}_/, '') // Remove date prefix if it exists
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Read file content and extract links
            const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
            const links = await extractLinks(content);
            
            const wordCount = countWords(content);
            return { name, title, links, wordCount };
          })
      )
    ).sort((a, b) => a.title.localeCompare(b.title));

    // Write the file list to a JSON file
    const outputPath = path.join(process.cwd(), 'src', 'content', 'content-list.json');
    await fs.writeFile(outputPath, JSON.stringify(mdxFiles, null, 2));
    console.log('Content list generated successfully!');
  } catch (error) {
    console.error('Error generating content list:', error);
    process.exit(1);
  }
}

generateContentList();
