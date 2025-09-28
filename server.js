require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(require('cors')());

// Serve React build
const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

// API to get meal plan
app.post('/api/gemini-food', async (req, res) => {
  const { age, sex, weight, height, goal } = req.body;
  if (!age || !sex || !weight || !height) return res.status(400).json({ error: 'Missing fields' });

  try {
    const prompt = `Create a daily meal plan for a ${age}-year-old ${sex}, ${weight}kg, ${height}cm, goal: ${goal || 'maintain'}.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) return res.status(502).json({ error: 'Gemini API error' });
    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    const plan = text.split('\n').filter(Boolean);
    res.json({ foodPlan: plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fallback to React app
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
