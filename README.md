# 📚 Rezzy AI Tutor — NEET PG Prep Assistant
DEMO - https://youtube.com/shorts/8X7jRCfzox4
An AI-powered medical tutoring app built with **React Native** and **Node.js**, featuring:

- ✅ Real-time LLM response streaming via **WebSockets**
- ✅ Smart JSON parsing for MCQs and Flashcards
- ✅ Interactive chat UI with typing animation
- ✅ Pinecone-powered semantic search
- ✅ Server-side prompt formatting and parsing

---

## 🚀 Features

- 🔌 **LLM Streaming** using OpenAI's `streamText()` with custom prompts
- 🧠 **Contextual Results** fetched from Pinecone vector store
- 🧾 **Structured Output** — emits JSON MCQs or Flashcards alongside chat stream
- 💬 **React Native Frontend** with typing animation and mode switching
- 🧹 Clean chunking & filtering to avoid `undefined` and garbage characters

---

## 🏗️ Tech Stack

| Layer         | Tech |
|---------------|------|
| Frontend      | React Native + Expo |
| Backend       | Node.js + socket.io |
| LLM API       | OpenAI via `ai` SDK |
| Vector Search | Pinecone |
| DB            | Prisma + Postgres |
| Hosting       | Local or any Node server |
| Sockets       | Socket.IO |
---

## ⚙️ Project Structure

```bash
.
├── backend/
│   ├── socket.ts             # socket.io logic
│   ├── lib/
│   │   ├── embedding.ts      # LLM & embedding logic
│   │   ├── pinecone.ts       # Pinecone index logic
│   │   └── prisma.ts         # Database client
├── app/
│   ├── components/
│   │   ├── BottomInput.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── FlashCard.tsx
│   │   └── QuizViewer.tsx
│   └── screens/
│       └── QuizScreen.tsx    # Main screen logic
├── assets/
├── README.md


SETUP 

##BACKEND##


cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY

npm run dev


##FRONTEND##

cd frontend
npm install
npx expo start
