# 🧠 DESIGN.md – Ask Rezzy

This document outlines the system design, architecture decisions, and limitations of *Ask Rezzy*, an AI-driven study assistant for medical students preparing for NEET PG.

---

## 1. Problem Recap

**Ask Rezzy** aims to make NEET PG preparation more efficient by:
- Letting users type medical queries in natural language
- Delivering real-time responses using LLMs
- Surfacing contextually relevant **MCQs** or **Flashcards** from a curated knowledge base
- Providing a conversational experience via a chat interface

**Core Value Proposition:**  
Turn passive studying into an interactive, contextual, LLM-enhanced learning experience.

---

## 2. Architecture Sketch

[React Native App]
|
| WebSocket Query
▼
[Node.js Express + Socket.IO Backend]
|
| Embedding via OpenAI
▼
[Pinecone Vector DB] ⇄ [OpenAI GPT-4o LLM]



- The app sends user queries over **WebSockets**
- The backend embeds the query, runs vector search on **Pinecone**
- Retrieved context is sent with the query to **OpenAI's GPT-4o**
- The backend streams the LLM's response to the frontend in real-time
- Any structured MCQ or Flashcard content is also parsed and sent as JSON

---

## 3. Vector Search Implementation

- **Embedding Strategy:**  
  - Model: `text-embedding-3-small` from OpenAI
  - Single and batched embedding support for queries and context
  
- **Similarity Search:**  
  - Top `K=8` results fetched using Pinecone vector similarity
  - Filtered by type: `flashcard` or `question`

- **RAG Pipeline:**  
  - Context is stitched from metadata (questions or flashcards)
  - Prompt includes both context and user query
  - LLM instructed to output an answer and reuse only the given context

---

## 4. Data Model (Not fully implemented)

- **Past Queries (Postgres via Prisma):**
  ```ts
  model PastQuery {
    id       Int     @id @default(autoincrement())
    query    String
    type     String   // 'question' or 'flashcard'
    createdAt DateTime @default(now())
  }


## 🧵 5. Streaming Flow

### 📤 Client → Server
- The client emits a query using WebSocket:
  ```ts
  socket.emit('query', { query, type });
  ```

### 🧠 Server-Side Flow
- Detects the mode: `'question'` or `'flashcard'` using LLM
- Fetches the embedding vector for the query using OpenAI
- Performs a vector search on Pinecone to retrieve relevant context
- Calls `streamText()` using `gpt-4o` from OpenAI SDK
- Uses a `reader.read()` loop to continuously receive streamed chunks

### 🧼 Chunk Filtering Logic
- Removes non-printable characters from the response
- Buffers data until a JSON marker (`MCQs:` or `Flashcards:`) is detected
- Extracts and emits only clean, readable text chunks before the structured content
- JSON is parsed separately after the stream ends and emitted via a different socket event

### 📲 Client-Side Rendering
- Text is rendered with a typewriter animation using `setTimeout`
- Once JSON is received, it's conditionally rendered as either:
  - Multiple Choice Questions (MCQs)
  - Flashcards

---

## 🧩 6. Component Breakdown

### 🟦 Frontend (React Native)

| File              | Responsibility                                             |
|-------------------|------------------------------------------------------------|
| `QuizScreen.tsx`  | Sets up socket, renders stream and quiz content            |
| `BottomInput.tsx` | Input component for user queries                           |
| `QuizViewer.tsx`  | Renders either MCQs or Flashcards based on data            |
| `RezzyHeader.tsx` | Branding and header visuals                                |

### 🟥 Backend (Node.js + Socket.IO)

| File             | Responsibility                                             |
|------------------|------------------------------------------------------------|
| `socket.ts`      | WebSocket event handling and stream orchestration          |
| `embedding.ts`   | Handles OpenAI embedding and chat completion streams       |
| `pinecone.ts`    | Pinecone vector DB client for semantic search              |
| `prisma.ts`      | Manages storing past queries in the database               |

---

## ⚠️ 7. Assumptions & Limitations

- ❗ **No offline support** – an active internet connection and backend server are required.
- ❗ **No authentication or user-specific sessions** implemented.
- ❗ **LLM prompt format is brittle** – relies on strict output from GPT-4o for consistent parsing.
- ❗ **SSE not supported** – only WebSockets are used for streaming.
- ❗ **Chunking may be inconsistent** – GPT-4o’s streaming behavior can result in unexpected splits requiring careful filtering.

