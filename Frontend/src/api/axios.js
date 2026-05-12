import axios from 'axios';
import { supabase } from '../supabaseClient';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
