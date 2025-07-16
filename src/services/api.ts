import axios from 'axios';
import { RestaurantSuggestion } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-patient-123'
  },
});

export const getSuggestions = async (
  location: { latitude: number; longitude: number }
): Promise<RestaurantSuggestion[]> => {
  try {
    const response = await apiClient.post('/suggestions', location);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch restaurant suggestions');
  }
};