import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import natural from 'natural';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentDir = join(__dirname, '../src/content');
const outputPath = join(__dirname, '../src/content/search-index.json');

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);

// Additional technical/common words to filter out
const additionalStopwords = new Set([
  'const', 'let', 'var', 'function', 'class', 'import', 'export',
  'return', 'true', 'false', 'null', 'undefined', 'async', 'await',
  'try', 'catch', 'if', 'else', 'for', 'while', 'do', 'switch',
  'case', 'break', 'continue', 'default', 'throw', 'new', 'delete',
  'typeof', 'instanceof', 'void', 'this', 'super', 'extends',
  'implements', 'interface', 'package', 'private', 'protected',
  'public', 'static', 'yield', 'code', 'example', 'using', 'use',
  'get', 'set', 'data', 'type', 'string', 'number', 'boolean',
  'object', 'array', 'file', 'files', 'directory', 'folder'
]);

async function readMdxFiles() {
  try {
    const contentList = JSON.parse(
      await readFile(join(contentDir, 'content-list.json'), 'utf-8')
    );
    
    const fileContents = await Promise.all(
      contentList.map(async ({ name }) => {
        const content = await readFile(join(contentDir, `${name}.mdx`), 'utf-8');
        return { name, content };
      })
    );
    return fileContents;
  } catch (error) {
    console.error('Error reading MDX files:', error);
    globalThis.process.exit(1);
  }
}

function processContent(content) {
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  content = content.replace(/`[^`]*`/g, '');
  // Remove URLs
  content = content.replace(/https?:\/\/[^\s)]+/g, '');
  // Remove HTML tags
  content = content.replace(/<[^>]*>/g, '');
  // Remove special characters and numbers
  content = content.replace(/[^a-zA-Z\s]/g, ' ');
  
  return content;
}

function isSignificantWord(word) {
  return (
    word.length > 2 && // Filter out short words
    !stopwords.has(word.toLowerCase()) &&
    !additionalStopwords.has(word.toLowerCase()) &&
    isNaN(word) // Filter out numbers
  );
}

function getWordFrequencies(files) {
  const wordFrequencies = new Map();
  const wordToFiles = new Map();

  files.forEach(({ name, content }) => {
    const processedContent = processContent(content);
    const words = tokenizer.tokenize(processedContent) || [];
    
    const uniqueWords = new Set(
      words
        .map(word => word.toLowerCase())
        .filter(isSignificantWord)
    );

    uniqueWords.forEach(word => {
      wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
      
      if (!wordToFiles.has(word)) {
        wordToFiles.set(word, new Set());
      }
      wordToFiles.get(word).add(name);
    });
  });

  return { wordFrequencies, wordToFiles };
}

async function generateSearchIndex() {
  try {
    const files = await readMdxFiles();
    const { wordFrequencies, wordToFiles } = getWordFrequencies(files);

    // Get top 25 words by frequency
    const topWords = Array.from(wordFrequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([word]) => word);

    // Create the final index
    const searchIndex = Object.fromEntries(
      topWords.map(word => [
        word,
        Array.from(wordToFiles.get(word))
      ])
    );

    // Save the index
    await writeFile(
      outputPath,
      JSON.stringify(searchIndex, null, 2),
      'utf-8'
    );

    console.log('Search index generated successfully!');
    console.log('Top 25 words:', topWords);
  } catch (error) {
    console.error('Error generating search index:', error);
    globalThis.process.exit(1);
  }
}

generateSearchIndex();
