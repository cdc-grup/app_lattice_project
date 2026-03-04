import express from 'express';
import cors from 'cors';
import { logger, errorHandler } from '@app/core';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
// We support both prefixed and unprefixed for Gateway flexibility
app.use('/auth', authRoutes);
app.use('/users', authRoutes); // User management is currently handled by the auth service
app.use(authRoutes);

app.use(errorHandler);

export default app;
