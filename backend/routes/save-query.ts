// routes/save-query.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/save-query', async (req, res) => {
  const { query , type} = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const saved = await prisma.pastQuery.create({ data: { query, type } });
  res.json(saved);
});

export default router;
