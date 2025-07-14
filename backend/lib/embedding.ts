import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
};

// --- lib/pinecone.ts ---
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export const searchInPinecone = async (embedding: number[], namespace = 'default', topK = 5) => {
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    namespace,
  });
  return result.matches || [];
};