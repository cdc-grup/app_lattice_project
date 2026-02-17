import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'auth_service_ok', timestamp: new Date() });
});

// --- ROUTES ---
app.post('/auth/ticket-sync', (req: Request, res: Response) => {
  res.json({ message: 'Ticket sync endpoint not implemented yet' });
});

app.get('/users/me', (req: Request, res: Response) => {
  res.json({ message: 'User profile endpoint not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
