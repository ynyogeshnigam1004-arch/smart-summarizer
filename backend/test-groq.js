import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroqAPI() {
  console.log('🧪 Testing Groq API...\n');
  console.log('API Key:', process.env.GROQ_API_KEY ? '✓ Found' : '✗ Missing');
  
  try {
    console.log('\n📡 Sending test request to Groq...');
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with valid JSON only.'
        },
        {
          role: 'user',
          content: 'Generate a simple test response with this JSON format: {"status": "success", "message": "API is working!"}'
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 100,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    console.log('\n✅ SUCCESS! Groq API is working!\n');
    console.log('Response:', response);
    console.log('\n🎉 Your Groq API key is valid and ready to use!');
    
  } catch (error) {
    console.error('\n❌ ERROR! Groq API test failed:\n');
    console.error('Error:', error.message);
    
    if (error.status === 401) {
      console.error('\n⚠️  Invalid API key. Please check your GROQ_API_KEY in .env file');
    } else if (error.status === 429) {
      console.error('\n⚠️  Rate limit exceeded. Wait a moment and try again.');
    } else {
      console.error('\n⚠️  Network or API error. Check your internet connection.');
    }
  }
}

testGroqAPI();
