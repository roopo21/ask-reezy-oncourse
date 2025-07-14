import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import queryRoutes from './routes/query';
import randomRoutes from './routes/randomQuery';

// Initialize .env config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/query', queryRoutes);
app.use('/api/random-query', randomRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
