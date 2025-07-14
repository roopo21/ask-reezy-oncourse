// routes/random.ts
import express from 'express';
import { getEmbedding, getChatCompletionStream } from '../lib/embedding';
import { index } from '../lib/pinecone';

const router = express.Router();

const randomTopics = [
    'Anatomy', 'Physiology', 'Pharmacology',
    'Cardiology', 'Microbiology', 'Pathology'
];

router.get('/random-query', async (req, res) => {
    try {
        // Pick a random topic
        const topic = randomTopics[Math.floor(Math.random() * randomTopics.length)];

        // Embed the topic
        const embedding = await getEmbedding(`Give me 5 questions on ${topic}`);

        const results = await index.query({
            vector: embedding,
            topK: 8,
            includeMetadata: true,
        });

        const context = results.matches?.map((m, i) => `${i + 1}. ${m.metadata?.question_text || m.metadata?.front_content}`).join('\n');
        const query = `Give me 5 questions on ${topic}`
        const textStream = await getChatCompletionStream(query, context);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');

        const reader = textStream.getReader();
        const encoder = new TextEncoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
                const chunk = encoder.encode(value);
                res.write(chunk);
            }
        }

        res.end();
    } catch (err) {
        console.error('❌ /random-query error:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
