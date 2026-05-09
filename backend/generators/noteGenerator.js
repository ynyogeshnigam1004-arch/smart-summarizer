import Groq from 'groq-sdk';
import { truncateText } from '../utils/truncate.js';
import { AppError } from '../utils/errors.js';

// Lazy initialization - create client only when needed
let groq = null;

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new AppError('GROQ_API_KEY not configured', 500);
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    console.log('✅ Groq client initialized with API key');
  }
  return groq;
}

const PROMPT_TEMPLATE = `You are an expert academic note-taker. Given the following content, produce structured notes in exactly this JSON format:
{
  "key_points": ["point1", "point2", ...],
  "bullet_summary": ["bullet1", "bullet2", ...],
  "chapters": [{"title": "...", "summary": "..."}]
}
Rules:
- key_points: minimum 3, each covering a distinct topic
- bullet_summary: minimum 3, each ≤ 25 words
- chapters: include only if the source has 2+ explicit headings, numbered chapters, or paragraph breaks of 3+ lines; omit the key entirely if fewer than 2 sections detected
- Do not contradict any named entity, number, or factual claim in the source

Content:
{text}`;

function isValidResponse(data) {
  return (
    Array.isArray(data.key_points) &&
    data.key_points.length >= 3 &&
    Array.isArray(data.bullet_summary) &&
    data.bullet_summary.length >= 3
  );
}

async function callGroq(prompt) {
  try {
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert note-taker. Always respond with valid JSON only, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Groq API error:', error);
    throw new AppError('AI service error', 503);
  }
}

export async function generateNotes(text) {
  const truncated = truncateText(text);
  const prompt = PROMPT_TEMPLATE.replace('{text}', truncated);

  // First attempt
  let data = await Promise.race([
    callGroq(prompt),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 30000)
    )
  ]).catch(() => {
    throw new AppError('AI service timeout', 503);
  });

  if (isValidResponse(data)) {
    return formatResponse(data);
  }

  // Retry once
  data = await Promise.race([
    callGroq(prompt),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 30000)
    )
  ]).catch(() => {
    throw new AppError('AI service timeout', 503);
  });

  if (isValidResponse(data)) {
    return formatResponse(data);
  }

  throw new AppError('Incomplete AI response', 503);
}

function formatResponse(data) {
  const result = {
    key_points: data.key_points,
    bullet_summary: data.bullet_summary
  };

  if (Array.isArray(data.chapters) && data.chapters.length >= 1) {
    result.chapters = data.chapters;
  }

  return result;
}
