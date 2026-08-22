import axios from './axios';

type QuoteMap = Record<string, { ask?: number | string }>;

export const getLastQuotes = (from: string, targets: string[]) => {
  const pairs = targets.map((to) => `${from}-${to}`).join(',');
  return axios.get<QuoteMap>(`/last/${pairs}`);
};
