import fs from 'fs/promises';
import path from 'path';

async function generateContentList() {
  try {
    const contentDir = path.join(process.cwd(), 'src', 'content');
    const files = await fs.readdir(contentDir);
    
    const mdxFiles = files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const name = file.replace('.mdx', '');
        // Convert kebab-case to Title Case, but handle date prefix specially
        const title = name
          .replace(/^\d{2}-\d{2}-\d{2}_/, '') // Remove date prefix if it exists
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return { name, title };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

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
