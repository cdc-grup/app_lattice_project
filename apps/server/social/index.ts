import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSockets } from './controllers/social.controller';

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSockets(io);

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () => {
  console.log(`[Social Service] running on port ${PORT}`);
});
