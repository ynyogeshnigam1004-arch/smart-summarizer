import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { summarizeRouter } from './routes/summarize.js';
import { errorHandler } from './middleware/errorHandler.js';

console.log('🔑 Environment loaded:');
console.log('  PORT:', process.env.PORT);
console.log('  GROQ_API_KEY:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 20)}...` : 'NOT FOUND');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads (20MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Routes
app.post('/log-error', (req, res) => {
  const { reason, timestamp } = req.body;
  console.error(`Client error at ${timestamp}: ${reason}`);
  res.json({ ok: true });
});

app.use('/summarize', upload.single('file'), summarizeRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AI Summarizer Backend running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints: POST /summarize, POST /log-error`);
});
