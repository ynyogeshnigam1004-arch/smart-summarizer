import { YoutubeTranscript } from 'youtube-transcript';
import { AppError } from '../utils/errors.js';

const YOUTUBE_REGEX = /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export async function extractYoutubeText(url) {
  if (!YOUTUBE_REGEX.test(url)) {
    throw new AppError('Invalid YouTube URL', 422);
  }

  try {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      throw new AppError('Could not extract video ID from URL', 422);
    }

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      throw new AppError('No captions available for this video. Please use a video with subtitles/captions enabled.', 422);
    }

    // Combine all transcript segments into one text
    const text = transcript
      .map(segment => segment.text)
      .join(' ')
      .trim();

    if (!text) {
      throw new AppError('No speech detected in video', 422);
    }

    return text;

  } catch (error) {
    if (error instanceof AppError) throw error;
    
    // Handle specific errors
    if (error.message.includes('Transcript is disabled') || error.message.includes('No transcript')) {
      throw new AppError('No captions available for this video. Please use a video with subtitles/captions enabled.', 422);
    }
    
    if (error.message.includes('private') || error.message.includes('unavailable')) {
      throw new AppError('Video is private or unavailable', 422);
    }
    
    console.error('YouTube extraction error:', error);
    throw new AppError('Could not access video. Make sure it is public and has captions enabled.', 422);
  }
}
