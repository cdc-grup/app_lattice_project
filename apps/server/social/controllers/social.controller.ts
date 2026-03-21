import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { redis } from '@app/core';

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'social_service_ok', timestamp: new Date() });
};

export const sendTelemetry = async (req: Request, res: Response) => {
  try {
    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required telemetry data' });
    }

    // 1. Store Geo position for proximity searches
    // NOTE: Redis uses [Longitude, Latitude] order
    await redis.geoadd('user_locations', longitude, latitude, userId);

    // 2. Store full telemetry snapshot with TTL (e.g., 24h)
    const telemetryData = JSON.stringify({
      latitude,
      longitude,
      timestamp: timestamp || new Date().toISOString(),
    });

    await redis.set(`user:telemetry:${userId}`, telemetryData, 'EX', 86400);

    res.status(202).json({ status: 'accepted', userId });
  } catch (error) {
    console.error('[Social Service] Telemetry error:', error);
    res.status(500).json({ error: 'Failed to process telemetry' });
  }
};

export const getTelemetry = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get from snapshot
    const data = await redis.get(`user:telemetry:${userId}`);

    if (!data) {
      return res.status(404).json({ error: 'Telemetry not found for user' });
    }

    res.json(JSON.parse(data));
  } catch (error) {
    console.error('[Social Service] Get telemetry error:', error);
    res.status(500).json({ error: 'Failed to retrieve telemetry' });
  }
};

export const createGroup = (req: Request, res: Response) => {
  res.json({ message: 'Groups endpoint not implemented yet' });
};

export const setupSockets = (io: Server) => {
  io.of('/live-track').on('connection', (socket) => {
    console.log(`[Social Service] Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Social Service] Socket disconnected: ${socket.id}`);
    });
  });
};
