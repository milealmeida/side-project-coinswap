import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { AwesomeQuote, AwesomeQuoteMap } from 'types/awesomeQuote';

import axios from './axios';

export const getLastQuotes = (
  from: AcceptedCurrencies,
  targets: AcceptedCurrencies[],
  config?: { signal?: AbortSignal }
) => {
  const pairs = targets.map((to) => `${from}-${to}`).join(',');
  return axios.get<AwesomeQuoteMap>(`/last/${pairs}`, config);
};

export const getDailyQuotes = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  days: 7 | 30,
  config?: { signal?: AbortSignal }
) => {
  return axios.get<AwesomeQuote[]>(`/json/daily/${from}-${to}/${days}`, config);
};
