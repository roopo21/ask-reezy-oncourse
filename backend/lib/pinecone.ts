import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export const searchInPinecone = async (embedding: number[], namespace = 'default', topK = 5) => {
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });
  return result.matches || [];
};