import pdfParse from 'pdf-parse';
import { AppError } from '../utils/errors.js';

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

export async function extractPdfText(buffer) {
  // Size check
  if (buffer.length > MAX_PDF_SIZE) {
    throw new AppError('PDF file too large (max 20MB)', 413);
  }

  // Magic bytes check
  if (buffer.slice(0, 4).toString() !== '%PDF') {
    throw new AppError('Invalid PDF file', 422);
  }

  try {
    const data = await pdfParse(buffer);
    const text = data.text;

    if (!text.trim()) {
      throw new AppError('PDF contains no extractable text', 422);
    }

    return text;
  } catch (error) {
    if (error.message.includes('password') || error.message.includes('encrypted')) {
      throw new AppError('PDF is password-protected', 422);
    }
    throw new AppError('Failed to extract PDF text', 422);
  }
}
