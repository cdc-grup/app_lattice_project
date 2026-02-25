import { POIGeoJSON } from '../index';

export type UIPOI = POIGeoJSON['properties'] & {
  geometry: POIGeoJSON['geometry'];
  distance?: string;
  time?: string;
};
