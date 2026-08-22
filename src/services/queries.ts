import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { AwesomeQuoteMap } from 'types/awesomeQuote';

import axios from './axios';

export const getLastQuotes = (
  from: AcceptedCurrencies,
  targets: AcceptedCurrencies[],
  config?: { signal?: AbortSignal }
) => {
  const pairs = targets.map((to) => `${from}-${to}`).join(',');
  return axios.get<AwesomeQuoteMap>(`/last/${pairs}`, config);
};
