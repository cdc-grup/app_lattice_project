import { DEFAULT_API_URL } from '../constants/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export interface ApiError {
  error?: {
    user_friendly_message?: string;
    code?: string;
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorData = data as ApiError;
    const message = errorData.error?.user_friendly_message || 'Unexpected server error';
    console.error(`[API Error] ${response.status}: ${message}`, data);
    throw new Error(message);
  }

  return data as T;
}

export const apiClient = {
  get: async <T>(endpoint: string, params?: Record<string, string>, token?: string): Promise<T> => {
    let urlString = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      urlString += `?${searchParams.toString()}`;
    }

    const response = await fetch(urlString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },
};
