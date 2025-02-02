require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

// Middleware
app.use(express.json()); // Allows server to parse JSON requests
app.use(cors()); // Allows frontend to connect to backend

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Test Route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// AI Pros & Cons Generation Route
app.post('/api/generate', async (req, res) => {
    const { issue, mood } = req.body;

    if (!issue || !mood) {
        return res.status(400).json({ error: "Missing issue or mood" });
    }

    const prompt = `
    Generate a pros and cons list for the following issue: "${issue}". 
    The user is feeling ${mood}. Provide a clear and concise list of pros and cons. 
    If the mood is happy, provide an optimistic view. 
    If the mood is anxious, provide a cautious or careful approach.
    `;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo", // Use appropriate model
                messages: [{ role: "user", content: prompt }],
                max_tokens: 200,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`, // Make sure the key is properly interpolated
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract the content from the API response
        const content = response.data.choices[0].message.content;

        // Send the content back as a string response
        res.json({ response: content });

    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate pros and cons." });
    }
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});