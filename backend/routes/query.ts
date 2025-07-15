// routes/query.ts
import express from 'express';
import { getEmbedding, getChatCompletionStream } from '../lib/embedding';
import { index } from '../lib/pinecone';
import { prisma } from '../lib/prisma';
const router = express.Router();

router.post('/', async (req, res) => {
    const { query, type } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    try {
        await prisma.pastQuery.create({
            data: {
                query,
                type
            },
        });

        // 2. Get embedding for the user query
        const embedding = await getEmbedding(query);

        // 3. Vector search on Pinecone
        const results = await index.query({
            vector: embedding,
            topK: 8,
            includeMetadata: true,
            filter: {
                type: type
            }
        });

        const context = results.matches
            ?.map((m, i) => {
                const meta = m.metadata || {};
                if (meta.type === 'question') {
                    return `${i + 1}.
Question: ${meta.question_text}
Options: ${JSON.stringify(meta.options, null, 2)}
Answer: ${meta.correct_answer}`;
                } else {
                    return `${i + 1}.
Flashcard Front: ${meta.front_content}
Back: ${meta.back_content}`;
                }
            })
            .join('\n\n');



        //   console.log(context, "check123");


        // 5. Generate answer via OpenAI (basic version)
        // const answer = await getChatCompletionStream(query, context);
        const textStream = await getChatCompletionStream(query, context, type);

        console.log(query, context);

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
        ;
    } catch (err) {
        console.error('❌ /query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
