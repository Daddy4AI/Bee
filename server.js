const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const MERRIAM_WEBSTER_API_KEY = '4c841aa5-4903-4de1-80d6-b81c397935a9';

app.post('/pronounce', async (req, res) => {
  const { word } = req.body;

  try {
    const response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${MERRIAM_WEBSTER_API_KEY}`);
    const data = response.data;

    if (Array.isArray(data) && data.length > 0 && data[0].hwi && data[0].hwi.prs && data[0].hwi.prs[0].sound && data[0].hwi.prs[0].sound.audio) {
      const audioFile = data[0].hwi.prs[0].sound.audio;
      let subdirectory = audioFile.charAt(0);

      if (audioFile.startsWith('bix')) {
        subdirectory = 'bix';
      } else if (audioFile.startsWith('gg')) {
        subdirectory = 'gg';
      } else if (/\d/.test(subdirectory)) {
        subdirectory = 'number';
      }

      const audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audioFile}.mp3`;
      res.json({ audioUrl });
    } else {
      res.status(404).send('Audio pronunciation not found');
    }
  } catch (error) {
    console.error('Error fetching pronunciation:', error);
    res.status(500).send('Error fetching pronunciation');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
