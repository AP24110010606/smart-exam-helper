const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Models to try in order — each has separate quota pools
const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash', 
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
];

/**
 * Use Google Gemini to generate meaningful Q/A flashcards from study text.
 * @param {string} text - The extracted text content from a material file.
 * @param {number} count - Approximate number of flashcards to generate (default 10).
 * @returns {Promise<Array<{question: string, answer: string}>>}
 */
async function generateFlashcardsWithAI(text, count = 10) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('GEMINI_API_KEY is not set. Falling back to rule-based parsing.');
    return null;
  }

  // Smart truncation: keep first part + sample from middle + end for coverage
  const maxChars = 15000;
  let trimmedText;
  if (text.length > maxChars) {
    const partSize = Math.floor(maxChars / 3);
    const start = text.slice(0, partSize);
    const midStart = Math.floor(text.length / 2) - Math.floor(partSize / 2);
    const middle = text.slice(midStart, midStart + partSize);
    const end = text.slice(text.length - partSize);
    trimmedText = `${start}\n\n[...content continues...]\n\n${middle}\n\n[...content continues...]\n\n${end}`;
    console.log(`Text truncated from ${text.length} to ~${trimmedText.length} chars (sampled start/middle/end)`);
  } else {
    trimmedText = text;
  }

  const prompt = `You are an expert study assistant. Analyze the following study material and generate exactly ${count} high-quality flashcards for a student to study from.

RULES:
1. Each flashcard must have a clear, specific "question" and a concise, accurate "answer".
2. Questions should test key concepts, definitions, formulas, facts, and important details from the material.
3. Answers should be brief but complete (1-3 sentences max).
4. Cover the most important topics across the entire material — don't repeat similar questions.
5. Use simple, clear language appropriate for studying.
6. Do NOT include numbering in the questions or answers.

STUDY MATERIAL:
---
${trimmedText}
---

Respond ONLY with a valid JSON array. No markdown, no code fences, no explanation. Example format:
[
  {"question": "What is photosynthesis?", "answer": "Photosynthesis is the process by which green plants use sunlight to convert carbon dioxide and water into glucose and oxygen."},
  {"question": "What organelle performs photosynthesis?", "answer": "The chloroplast is the organelle responsible for photosynthesis in plant cells."}
]`;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Try each model until one works
  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text().trim();

      // Strip markdown code fences if the model wraps them
      responseText = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(responseText);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.error(`${modelName}: AI returned invalid format:`, responseText.slice(0, 200));
        continue;
      }

      // Validate and clean each pair
      const flashcards = parsed
        .filter((item) => item && typeof item.question === 'string' && typeof item.answer === 'string')
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter((item) => item.question.length > 0 && item.answer.length > 0);

      if (flashcards.length === 0) {
        console.error(`${modelName}: AI returned no valid flashcard pairs.`);
        continue;
      }

      console.log(`AI generated ${flashcards.length} flashcards successfully using ${modelName}.`);
      return flashcards;
    } catch (err) {
      const errMsg = err.message || String(err);
      console.error(`${modelName} failed: ${errMsg.slice(0, 200)}`);
      
      // If rate limited, try next model
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
        console.log(`Rate limited on ${modelName}, trying next model...`);
        continue;
      }
      
      // For other errors, also try next model
      continue;
    }
  }

  console.error('All AI models failed. Falling back to rule-based parsing.');
  return null;
}

module.exports = { generateFlashcardsWithAI };
