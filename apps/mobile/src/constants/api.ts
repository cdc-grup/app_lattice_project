export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    TICKET_CLAIM: '/auth/ticket/claim',
    ME: '/auth/me',
  },
  GEO: {
    POIS: '/pois',
    CATEGORIES: '/categories',
    NAVIGATION: '/navigation/route',
  },
  SOCIAL: {
    GROUPS: '/groups',
    TELEMETRY: '/telemetry',
  },
};

export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';
