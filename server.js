const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.question }]
    })
  });
  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.post('/video', async (req, res) => {
  const didKey = Buffer.from(process.env.DID_API_KEY).toString('base64');
  const response = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${didKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        subtitles: false,
        provider: { type: 'microsoft', voice_id: 'it-IT-GiuliaNeural' },
        ssml: false,
        input: req.body.text
      },
      config: { fluent: true, pad_audio: 0.5 },
      source_url: process.env.IMAGE_URL
    })
  });
  const data = await response.json();
  res.json({ url: `https://studio.d-id.com/talks/${data.id}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});