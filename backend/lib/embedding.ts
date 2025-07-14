import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

import { streamText } from 'ai';
import { openai as OpenAIStream } from '@ai-sdk/openai';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getEmbedding = async (text: string): Promise<number[]> => {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return response.data[0].embedding;
};


export async function getEmbeddingsWithRetry(texts: string[], attempt = 1): Promise<number[][]> {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: texts,
        });
        return response.data.map((item) => item.embedding);
    } catch (err: any) {
        if (err.code === "rate_limit_exceeded") {
            const waitTime = Math.min(60000, 1000 * 2 ** attempt); // max 60s
            console.warn(`⚠️ Rate limit hit. Retrying in ${waitTime / 1000}s... (Attempt ${attempt})`);
            await new Promise((res) => setTimeout(res, waitTime));
            return getEmbeddingsWithRetry(texts, attempt + 1);
        }
        throw err;
    }
};


export async function getChatCompletionStream(userQuery: string, context: string, type: string) {
//     const prompt = `
// You are an AI assistant helping students prepare for medical PG exams.
// Use the following context to answer the user’s question.

// Context:
// ${context}

// User Query:
// ${userQuery}
// `;
const systemPrompt =
  type === 'question'
    ? `You are a helpful and concise medical tutor.

Step 1: Answer the user's medical query clearly and briefly using only the context provided below.

Step 2: From the list of questions in the context, pick the 5 most relevant to the user's query. Do NOT generate new questions — select only from the context.

You must respond in this **exact format**:

Answer:
<short answer to the user's question>

MCQs:
[
  {
    "type": "mcq",
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct option"
  },
  ...
]

Only include valid JSON objects in the array. Do not output any additional text outside this format.

Context:
${context}

Query:
${userQuery}`
    : `You are a helpful and concise medical tutor.

Step 1: Answer the user's medical query clearly and briefly using only the context provided below.

Step 2: From the flashcards in the context, pick the 5 most relevant to the user's query. Do NOT generate new flashcards — select only from the context.

You must respond in this **exact format**:

Answer:
<short answer to the user's question>

Flashcards:
[
  {
    "type": "flashcard",
    "front": "Question or prompt",
    "back": "Answer or explanation"
  },
  ...
]

Only include valid JSON objects in the array. Do not output any additional text outside this format.

Context:
${context}

Query:
${userQuery}`;


    const {textStream} = await streamText({
        model: OpenAIStream('gpt-4o'),
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
        ],
    });
    console.log("chatCompletion baby");
    return textStream; // ⬅️ replaces StreamingTextResponse
}




