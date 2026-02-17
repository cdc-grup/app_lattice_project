import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, pointsOfInterest, sql } from '@app/db';

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
app.get('/pois', async (req: Request, res: Response) => {
  try {
    const results = await db.select({
      id: pointsOfInterest.id,
      name: pointsOfInterest.name,
      type: pointsOfInterest.type,
      description: pointsOfInterest.description,
      geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`
    }).from(pointsOfInterest);

    const features = results.map(poi => ({
      type: 'Feature',
      geometry: JSON.parse(poi.geometry as string),
      properties: {
        id: poi.id,
        name: poi.name,
        category: poi.type,
        description: poi.description
      }
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
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
