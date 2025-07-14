import express from 'express';
import { getEmbedding } from '../lib/embedding';
import { searchInPinecone } from '../lib/pinecone';

export const queryRouter = express.Router();

queryRouter.post('/', async (req, res) => {
  const { topic } = req.body;

  if (!topic) return res.status(400).json({ error: 'Missing topic' });

  try {
    const embedding = await getEmbedding(topic);
    const results = await searchInPinecone(embedding, 'questions');
    res.json({ results });
  } catch (error) {
    console.error('Query Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
