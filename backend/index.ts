import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import queryRoutes from './routes/query';
import randomRoutes from './routes/randomQuery';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocket } from './socket';

// Initialize .env config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/query', queryRoutes);
app.use('/api/random-query', randomRoutes);

setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
