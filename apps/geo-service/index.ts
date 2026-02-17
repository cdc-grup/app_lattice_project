import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'geo_service_ok', timestamp: new Date() });
});

// --- ROUTES ---
app.get('/pois', (req: Request, res: Response) => {
  res.json({ message: 'POIs endpoint not implemented yet' });
});

app.get('/locations', (req: Request, res: Response) => {
  res.json({ message: 'Locations endpoint not implemented yet' });
});

app.post('/navigation/route', (req: Request, res: Response) => {
  res.json({ message: 'Navigation endpoint not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`[Geo Service] running on port ${PORT}`);
});
