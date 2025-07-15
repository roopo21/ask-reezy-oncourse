import { Server as SocketIOServer, Socket } from 'socket.io';
import { getEmbedding, getChatCompletionStream, detectModeFromQuery } from './lib/embedding';
import { index } from './lib/pinecone';
import { prisma } from './lib/prisma';

export const setupSocket = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log('⚡ Client connected');

    socket.on('query', async ({ query, type, random }) => {
      if (!query || !type) {
        socket.emit('error', 'Missing query or type');
        return;
      }

      try {
        // Generate random topic if asked
        if (random) {
          const topics = ['anatomy', 'physiology', 'pharma', 'biochem', 'pathology'];
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          query = `Give me 5 important ${type === 'flashcard' ? 'flashcards' : 'MCQs'} on ${randomTopic} for NEET PG.`;
        } else {
          // Auto-detect type if not forced
          type = await detectModeFromQuery(query) || 'flashcard';
        }

        // Save the query to DB
        await prisma.pastQuery.create({ data: { query, type } });

        // Get query embedding
        const embedding = await getEmbedding(query);

        // Search Pinecone
        const results = await index.query({
          vector: embedding,
          topK: 8,
          includeMetadata: true,
          filter: { type },
        });

        // Format context for LLM
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

        // Start LLM stream
        const textStream = await getChatCompletionStream(query, context, type);
        const reader = textStream.getReader();

        const splitMarker = type === 'question' ? 'MCQs:' : 'Flashcards:';
        let buffer = '';
        let jsonStarted = false;
function isSafeChunk(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '' && str !== 'undefined';
}

while (true) {
  const { value, done } = await reader.read();
  if (done) break;

  if (value) {
    const chunk = value.toString();
    buffer += chunk;

    if (!jsonStarted && buffer.includes(splitMarker)) {
      jsonStarted = true;

      const [preJson] = buffer.split(splitMarker);
      const clean = preJson
        .replace(/[^\x20-\x7E\s]/g, '') // strip non-printable characters
        .replace(/Answer:/gi, '')      // optional: strip labels
        .trim();

      if (isSafeChunk(clean)) {
        console.log(clean, 'clean chunk')
        socket.emit('stream', clean);
      }
    } else if (!jsonStarted) {
      const cleanChunk = chunk
        .replace(/[^\x20-\x7E\s]/g, '') // clean junk
        .trim();

    //   if (isSafeChunk(cleanChunk)) {
    //     console.log(cleanChunk, 'clean chunk 2')

    //     // socket.emit('stream', cleanChunk);
    //   }
    }
  }
}



        // Parse structured JSON if present
        if (buffer.includes(splitMarker)) {
          const [, jsonPart] = buffer.split(splitMarker);
          const endIndex = jsonPart.lastIndexOf(']');
          if (endIndex !== -1) {
            const cleanJson = jsonPart.slice(0, endIndex + 1);
            try {
              const parsed = JSON.parse(cleanJson);
              if (Array.isArray(parsed)) {
                socket.emit('json', parsed);
              } else {
                console.warn('⚠️ Parsed JSON is not an array:', parsed);
              }
            } catch (err) {
              console.warn('⚠️ Could not parse structured response:', err);
            }
          } else {
            console.warn('⚠️ JSON array incomplete — missing closing bracket');
          }
        }

        socket.emit('end');
      } catch (err) {
        console.error('❌ Socket error:', err);
        socket.emit('error', 'Internal server error');
      }
    });

    socket.on('disconnect', () => {
      console.log('🚪 Client disconnected');
    });
  });
};

