import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router();
const MEMES_FILE = path.join(process.cwd(), 'data', 'memes.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(MEMES_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  try {
    await fs.access(MEMES_FILE);
  } catch {
    await fs.writeFile(MEMES_FILE, JSON.stringify([]));
  }
}

router.get('/memes', async (req, res) => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(MEMES_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read memes' });
  }
});

router.post('/memes', async (req, res) => {
  await ensureDataDir();
  try {
    const { topText, bottomText, image, profileName, elements } = req.body;
    const data = await fs.readFile(MEMES_FILE, 'utf-8');
    const memes = JSON.parse(data);
    
    const newMeme = {
      id: Date.now().toString(),
      topText,
      bottomText,
      image,
      profileName,
      elements,
      createdAt: new Date().toISOString()
    };
    
    memes.unshift(newMeme);
    // Keep only last 50 memes for the demo
    const limitedMemes = memes.slice(0, 50);
    
    await fs.writeFile(MEMES_FILE, JSON.stringify(limitedMemes, null, 2));
    res.status(201).json(newMeme);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save meme' });
  }
});

export default router;
