// scripts/uploadQuestions.ts
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getEmbeddingsWithRetry } from '../lib/embedding';
import { index } from '../lib/pinecone';

dotenv.config();

const QUESTIONS_PATH = path.join(__dirname, '../../data/indian-medical-pg-questions.json');

interface Question {
  id: string;
  question_text: string;
  explanation: string;
  subject: string;
  topic: string;
  options: {
    text: string;
    is_correct: boolean;
  }[];
}

async function uploadQuestions() {
  const rawData = JSON.parse(readFileSync(QUESTIONS_PATH, 'utf8'));
  const questions: Question[] = rawData.questions;

  const BATCH_SIZE = 50;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);

    const texts = batch.map((q) => q.question_text);
    const embeddings = await getEmbeddingsWithRetry(texts);

    const vectors = batch.map((q, index) => {
      return {
        id: q.id,
        values: embeddings[index],
        metadata: {
          type: 'question',
          question_text: q.question_text,
          subject: q.subject,
          topic: q.topic,
          explanation: q.explanation,
          options: q.options.map((o) => o.text).join(' | '),
          correct_answer: q.options.find((o) => o.is_correct)?.text || '',
        },
      };
    });

    try {
      await index.upsert(vectors);
      console.log(`✅ Uploaded batch ${i}–${i + BATCH_SIZE}`);
    } catch (err) {
      console.error('❌ Error uploading batch:', err);
    }
  }

  console.log('🎉 All questions uploaded to Pinecone');
}

uploadQuestions();
