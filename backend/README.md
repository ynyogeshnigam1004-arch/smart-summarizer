# AI Smart Summarizer - Node.js Backend

Express.js backend for the AI Smart Summarizer application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your API key to `.env`:
- `GROQ_API_KEY` - Get from https://console.groq.com/keys (free!)

4. Run backend:

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:8000`

## API Endpoints

- `POST /summarize` - Generate notes from PDF/YouTube/Text
- `POST /log-error` - Log client errors

## Features

- PDF text extraction (max 20MB)
- **YouTube caption extraction** - Uses auto-generated captions (no audio transcription needed!)
- **Direct text input** - Paste paragraphs/articles for instant summarization
- AI-powered note generation with **Groq (Llama 3.3 70B)** - Super fast and free!
- Structured output: key points, bullet summary, chapters
