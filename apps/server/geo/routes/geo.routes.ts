import { Router } from 'express';
import * as geoController from '../controllers/geo.controller';

const router = Router();

router.get('/health', geoController.healthCheck);
router.get('/pois', geoController.getPois);
router.get('/pois/categories', geoController.getCategories);
router.get('/locations', geoController.getLocations);
router.post('/navigation/route', geoController.getRoute);

export default router;
