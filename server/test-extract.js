require('dotenv').config();
const path = require('path');
const { extractTextFromFile } = require('./src/utils/parseFlashcards');

const uploadDir = path.join(__dirname, 'uploads');

async function test() {
  const files = require('fs').readdirSync(uploadDir).filter(f => f.endsWith('.pdf'));
  console.log('PDF files found:', files);
  
  if (files.length === 0) {
    console.log('No PDF files found in uploads/');
    return;
  }
  
  const testFile = path.join(uploadDir, files[0]);
  console.log(`\nTesting extraction on: ${files[0]} (${(require('fs').statSync(testFile).size / 1024 / 1024).toFixed(1)} MB)`);
  console.log('This may take a moment for large files...\n');
  
  try {
    const text = await extractTextFromFile(testFile);
    if (text && text.trim()) {
      console.log(`SUCCESS! Extracted ${text.length} characters.`);
      console.log('\n--- First 2000 characters ---');
      console.log(text.substring(0, 2000));
      console.log('\n--- End preview ---');
    } else {
      console.log('FAILED: No text extracted from PDF.');
    }
  } catch (err) {
    console.error('ERROR during extraction:', err.message);
  }
}

test();
