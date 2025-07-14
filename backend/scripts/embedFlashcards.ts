// scripts/uploadFlashcards.ts
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getEmbedding } from '../lib/embedding';
import { index } from '../lib/pinecone';

dotenv.config();

const FLASHCARDS_PATH = path.join(__dirname, '../../data/indian-medical-pg-flashcards.json');

interface Flashcard {
    id: string;
    front_content: string;
    back_content: string;
    subject: string;
    topic: string;
    card_type: string;
    card_variant: string;
    image_urls: string[] | null;
}

async function uploadFlashcards() {
    const rawData = JSON.parse(readFileSync(FLASHCARDS_PATH, 'utf8'));
    const flashcards: Flashcard[] = rawData.flashcards;

    const BATCH_SIZE = 50;

    for (let i = 0; i < flashcards.length; i += BATCH_SIZE) {
        const batch = flashcards.slice(i, i + BATCH_SIZE);

        const vectors = await Promise.all(
            batch.map(async (card) => {
                const embedding = await getEmbedding(card.front_content);
                return {
                    type: 'flashcard',
                    id: card.id,
                    values: embedding,
                    metadata: {
                        subject: card.subject,
                        topic: card.topic,
                        back_content: card.back_content,
                        card_type: card.card_type,
                        card_variant: card.card_variant,
                    },
                };
            })
        );

        try {
            await index.upsert(vectors);
            console.log(`✅ Uploaded batch ${i}–${i + BATCH_SIZE}`);
        } catch (err) {
            console.error('❌ Error uploading batch:', err);
        }
    }

    console.log('🎉 All flashcards uploaded to Pinecone');
}

uploadFlashcards();
