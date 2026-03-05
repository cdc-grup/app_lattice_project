import { Request, Response } from 'express';
import { db, pointsOfInterest, sql } from '@app/db';

import { findRoute } from '../services/navigation.service';

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'geo_service_ok', timestamp: new Date() });
};

export const getPois = async (req: Request, res: Response) => {
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
};

export const getCategories = (req: Request, res: Response) => {
  const categories = [
    { id: '1', label: 'Gates', icon: 'log-in', category: 'gate' },
    { id: '2', label: 'Grandstands', icon: 'map', category: 'grandstand' },
    { id: '3', label: 'Food', icon: 'coffee', category: 'restaurant' },
    { id: '4', label: 'Parking', icon: 'map-pin', category: 'parking' },
    { id: '5', label: 'Shopping', icon: 'shopping-bag', category: 'shop' },
    { id: '6', label: 'Toilets', icon: 'user', category: 'wc' },
    { id: '7', label: 'Medical', icon: 'plus-square', category: 'medical' },
    { id: '8', label: 'Meetups', icon: 'users', category: 'meetup_point' },
  ];
  res.json(categories);
};

export const getLocations = (req: Request, res: Response) => {
  res.json({ message: 'Locations endpoint not implemented yet' });
};

export const getRoute = async (req: Request, res: Response) => {
  try {
    const { origin, destination, avoidStairs } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const route = await findRoute(origin, destination, { avoidStairs });
    res.json(route);
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
};
