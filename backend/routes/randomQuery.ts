import express from 'express';
import { getEmbedding } from '../lib/embedding';
import { searchInPinecone } from '../lib/pinecone';

const topics = [
  'anatomy',
  'cardiology',
  'neurology',
  'muscular system',
  'skeletal system'
];

export const randomRouter = express.Router();

randomRouter.post('/', async (_req, res) => {
  try {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const embedding = await getEmbedding(topic);
    const results = await searchInPinecone(embedding, 'questions');
    res.json({ topic, results });
  } catch (error) {
    console.error('Random Query Error:', error);
    res.status(500).json({ error: 'Failed to get random query' });
  }
});