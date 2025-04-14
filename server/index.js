// server/index.js
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 5000;

// Basic Route
app.get('/', (req, res) => {
  res.send('SmartTour API is running 🚀');
});

// AI Route for generating itinerary
app.post('/generate-itinerary', async (req, res) => {
  const { destination, days, interests } = req.body;

  // Prompt for OpenAI
  const prompt = `Create a ${days}-day itinerary for a trip to ${destination} focusing on ${interests}.`;

  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // Change to GPT-3.5
        messages: [
          { role: 'system', content: 'You are a helpful travel assistant.' },
          { role: 'user', content: `Plan a ${days}-day trip to ${destination} focusing on ${interests}.` }
        ]
      });

    const itinerary = response.choices[0].message.content;
    res.json({ itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
