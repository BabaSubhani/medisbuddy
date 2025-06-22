import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import medRoutes from './routes/medications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


initDatabase();


app.use('/api/auth', authRoutes);
app.use('/api/meds', medRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MedsBuddy API is running' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the MedsBuddy API');
});


app.listen(PORT, () => {
  console.log(`Server running on port https://medisbuddy-server.onrender.com`);
});