import express from 'express';
import cors from 'cors';
import { logger, errorHandler } from '@app/core';
import socialRoutes from './routes/social.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/groups', socialRoutes);
app.use(socialRoutes);

app.use(errorHandler);

export default app;
