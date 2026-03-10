import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEMES_FILE = path.join(process.cwd(), 'data', 'memes.json');

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

export async function GET() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(MEMES_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read memes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await ensureDataDir();
  try {
    const body = await req.json();
    const { topText, bottomText, image, profileName, elements, showImage, showHeader } = body;
    
    const data = await fs.readFile(MEMES_FILE, 'utf-8');
    const memes = JSON.parse(data);
    
    const newMeme = {
      id: Date.now().toString(),
      topText,
      bottomText,
      image,
      profileName,
      elements,
      showImage,
      showHeader,
      createdAt: new Date().toISOString()
    };
    
    memes.unshift(newMeme);
    const limitedMemes = memes.slice(0, 50);
    
    await fs.writeFile(MEMES_FILE, JSON.stringify(limitedMemes, null, 2));
    return NextResponse.json(newMeme, { status: 201 });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save meme' }, { status: 500 });
  }
}
