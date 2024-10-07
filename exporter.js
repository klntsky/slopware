// Import necessary modules
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileTypeFromFile } from 'file-type';

const ignoreFiles = [
  'package-lock.json',
  '.gitignore',
  'jest.config.js',
];

const cutFiles = [
  // {
  //   file: 'public/static/some-file.json',
  //   lines: 15
  // }
];

const topLevelPrompt = `
Here is the current state of the project source files. Start with this state fresh.
`;

const embedFile = filePath => {
  let content = readFileSync(filePath, 'utf8');
  let truncated = null;
  for (const cutFile of cutFiles) {
    if (cutFile.file != filePath) continue;
    truncated = cutFile.lines;
    break;
  }

  let fileHead = `${filePath}`;
  if (truncated !== null) {
    fileHead = `${filePath} (truncated)`;
    content = content.split('\n').slice(0, truncated).join('\n');
  }
  return `${fileHead}\n\`\`\`\n${content.trimEnd()}\n\`\`\`\n`;
};

// Function to check if a file is a text file using its MIME type
async function isTextFile(filePath) {
  const fileType = await fileTypeFromFile(filePath);

  // If fileType is undefined, we assume it's a text file (file-type doesn't detect common text files like .txt)
  if (!fileType || fileType.mime.startsWith('text')) {
    console.log(filePath, fileType);
    return true;
  }

  return false;
}

// Function to get list of tracked files in the Git repository (excluding .gitignored)
function getTrackedFiles() {
  const result = execSync('git ls-files', { encoding: 'utf8' });
  return result.split('\n')
    .filter(file => file.trim() !== '')
    .filter(file => !ignoreFiles.some(ignoredFile => file.includes(ignoredFile)));
}

// Function to embed file content in markdown format
async function embedFilesInMarkdown(files) {
  let markdownContent = '';

  for (const filePath of files) {
    if (await isTextFile(filePath)) {
      let content = embedFile(filePath);
      markdownContent += '\n' + content;
    }
  }

  return markdownContent;
}

// Main function to generate the markdown file
async function generateMarkdownFile(outputFile) {
  const files = getTrackedFiles();
  const markdownContent = topLevelPrompt + '\n' + await embedFilesInMarkdown(files);

  // Write the markdown content to the output file
  writeFileSync(outputFile, markdownContent);
  console.log(`Markdown file generated at: ${outputFile}`);
}

// Call the main function
generateMarkdownFile('embedded_files.md');
