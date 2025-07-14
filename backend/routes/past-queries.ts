// routes/past-queries.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();
router.get('/past-queries', async (req, res) => {
  const queries = await prisma.pastQuery.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(queries);
});
