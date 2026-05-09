import express from 'express';
import { extractPdfText } from '../extractors/pdfExtractor.js';
import { extractYoutubeText } from '../extractors/youtubeExtractor.js';
import { generateNotes } from '../generators/noteGenerator.js';
import { AppError } from '../utils/errors.js';

export const summarizeRouter = express.Router();

summarizeRouter.post('/', async (req, res, next) => {
  try {
    const { input_type, youtube_url, text_content } = req.body;
    const file = req.file;
    let text = '';

    switch (input_type) {
      case 'pdf':
        if (!file) throw new AppError('No file uploaded', 400);
        text = await extractPdfText(file.buffer);
        break;

      case 'youtube':
        if (!youtube_url) throw new AppError('No YouTube URL provided', 400);
        text = await extractYoutubeText(youtube_url);
        break;

      case 'text':
        if (!text_content || !text_content.trim()) {
          throw new AppError('No text content provided', 400);
        }
        text = text_content.trim();
        break;

      default:
        throw new AppError('Invalid input type', 400);
    }

    if (!text.trim()) {
      throw new AppError('No content could be extracted', 422);
    }

    const notes = await generateNotes(text);
    res.json(notes);

  } catch (error) {
    next(error);
  }
});
