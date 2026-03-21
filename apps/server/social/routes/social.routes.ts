import { Router } from 'express';
import * as socialController from '../controllers/social.controller';

const router = Router();

router.get('/health', socialController.healthCheck);
router.post('/groups', socialController.createGroup);

// Telemetry
router.post('/telemetry', socialController.sendTelemetry);
router.get('/telemetry/:userId', socialController.getTelemetry);

export default router;
