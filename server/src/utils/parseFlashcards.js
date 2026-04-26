const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * MVP flashcard generation: parse plain text into Q/A pairs.
 * Rules (in order):
 * 1. Split by blank lines into blocks; first line = question, rest = answer.
 * 2. Or lines like "Q: ..." / "A: ..." grouped in pairs.
 */
function parseTextToPairs(rawText) {
  const text = (rawText || '').trim();
  if (!text) return [];

  // Try Q:/A: format first
  const blocks = [];
  const qLines = [...text.matchAll(/^\s*Q:\s*(.+)$/gim)];
  const aLines = [...text.matchAll(/^\s*A:\s*(.+)$/gim)];
  if (qLines.length > 0 && qLines.length === aLines.length) {
    for (let i = 0; i < qLines.length; i++) {
      blocks.push({
        question: qLines[i][1].trim(),
        answer: aLines[i][1].trim(),
      });
    }
    return blocks.filter((b) => b.question && b.answer);
  }

  // Paragraph mode: double newline separates cards
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const pairs = [];
  for (const p of paragraphs) {
    const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const question = lines[0];
    const answer = lines.slice(1).join('\n') || question;
    pairs.push({ question, answer });
  }
  if (pairs.length > 0) return pairs.filter((x) => x.question);

  return generateFallbackPairs(text);
}

function generateFallbackPairs(text) {
  const sentences = text
    .replace(/\s+/g, ' ')
    .match(/[^\.!\?]+[\.!\?]+/gim)
    ?.map((s) => s.trim()) || [];

  if (sentences.length >= 2) {
    const pairs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const question = sentences[i];
      const answer = sentences[i + 1] || question;
      pairs.push({ question, answer });
    }
    return pairs.filter((x) => x.question);
  }

  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    const pairs = [];
    for (let i = 0; i < lines.length; i += 2) {
      const question = lines[i];
      const answer = lines[i + 1] || question;
      pairs.push({ question, answer });
    }
    return pairs.filter((x) => x.question);
  }

  return [{ question: text, answer: text }];
}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.txt' || ext === '.md') {
      const text = fs.readFileSync(filePath, 'utf8');
      console.log(`Extracted ${text.length} chars from ${ext}`);
      return text;
    }
    if (ext === '.html') {
      const html = fs.readFileSync(filePath, 'utf8');
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`Extracted ${text.length} chars from HTML`);
      return text;
    }
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      console.log(`Reading PDF file (${(dataBuffer.length / 1024 / 1024).toFixed(1)} MB)...`);
      
      // pdf-parse v1.1.1 — direct function call
      const data = await pdfParse(dataBuffer);
      if (data.text && data.text.trim()) {
        console.log(`Extracted ${data.text.length} chars from PDF (${data.numpages} pages)`);
        return data.text;
      }

      console.log('PDF text extraction returned no text.');

      // Fallback regex scan for binary PDFs
      const raw = dataBuffer.toString('latin1');
      const matches = raw.match(/[A-Za-z][A-Za-z0-9 \-\(\),:\.\;'"\\n]{50,}/g);
      if (matches && matches.length) {
        const text = matches.slice(0, 10).join(' ').replace(/\s+/g, ' ').trim();
        console.log(`Extracted ${text.length} chars from PDF fallback regex`);
        return text;
      }
      console.log('PDF extract returned no text for', filePath);
      return '';
    }
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value || '';
      console.log(`Extracted ${text.length} chars from DOCX`);
      return text;
    }
  } catch (err) {
    console.error('Text extraction failed:', filePath, ext, err);
  }
  return '';
}

module.exports = { parseTextToPairs, extractTextFromFile };
