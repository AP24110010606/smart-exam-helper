const fs = require('fs');
const path = require('path');

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
  return pairs.filter((x) => x.question);
}

/**
 * Read .txt file from disk (MVP: only text files yield content).
 */
function readTextFileSafe(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.txt') return '';
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

module.exports = { parseTextToPairs, readTextFileSafe };
