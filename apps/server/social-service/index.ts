import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'social_service_ok', timestamp: new Date() });
});

// --- ROUTES ---
app.post('/groups', (req: Request, res: Response) => {
  res.json({ message: 'Groups endpoint not implemented yet' });
});

// --- SOCKET.IO ---
io.of('/live-track').on('connection', (socket) => {
  console.log(`[Social Service] Socket connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[Social Service] Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Social Service] running on port ${PORT}`);
});
