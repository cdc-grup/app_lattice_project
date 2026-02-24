import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, pointsOfInterest, sql } from '@app/db';
import { logger } from '@app/core';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(logger);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'geo_service_ok', timestamp: new Date() });
});

// --- ROUTES ---
app.get('/pois', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    let query = db
      .select({
        id: pointsOfInterest.id,
        name: pointsOfInterest.name,
        type: pointsOfInterest.type,
        description: pointsOfInterest.description,
        crowdLevel: pointsOfInterest.crowdLevel,
        isWheelchairAccessible: pointsOfInterest.isWheelchairAccessible,
        hasPriorityLane: pointsOfInterest.hasPriorityLane,
        geometry: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .$dynamic();

    if (category && typeof category === 'string') {
      query = query.where(sql`${pointsOfInterest.type}::text = ${category}`);
    }

    const results = await query;

    const features = results.map((poi) => ({
      type: 'Feature',
      geometry: JSON.parse(poi.geometry as string),
      properties: {
        id: poi.id,
        name: poi.name,
        category: poi.type,
        description: poi.description,
        crowdLevel: poi.crowdLevel,
        isWheelchairAccessible: poi.isWheelchairAccessible,
        hasPriorityLane: poi.hasPriorityLane,
      },
    }));

    res.json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
});

app.get('/pois/categories', (req: Request, res: Response) => {
  const categories = [
    { id: '1', label: 'Gates', icon: 'door-open', category: 'gate' },
    { id: '2', label: 'Grandstands', icon: 'stadium-variant', category: 'grandstand' },
    { id: '3', label: 'Food', icon: 'food', category: 'restaurant' },
    { id: '4', label: 'Parking', icon: 'parking', category: 'parking' },
    { id: '5', label: 'Shopping', icon: 'shopping', category: 'shop' },
    { id: '6', label: 'Toilets', icon: 'toilet', category: 'wc' },
    { id: '7', label: 'Medical', icon: 'medical-bag', category: 'medical' },
    { id: '8', label: 'Meetups', icon: 'account-group', category: 'meetup_point' },
  ];
  res.json(categories);
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
