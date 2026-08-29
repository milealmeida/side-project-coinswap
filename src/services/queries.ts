import { isAxiosError } from 'axios';

import {
  isAcceptedCurrency,
  type AcceptedCurrencies
} from 'types/acceptedCurrencies';
import { AwesomeQuote, AwesomeQuoteMap } from 'types/awesomeQuote';

import http from './axios';

type AwesomeErrorBody = {
  code?: string;
  message?: string;
};

const quoteKey = (from: AcceptedCurrencies, to: AcceptedCurrencies) =>
  `${from}${to}`.toUpperCase();

const parseMissingTarget = (
  from: AcceptedCurrencies,
  error: unknown
): AcceptedCurrencies | undefined => {
  if (!isAxiosError(error) || error.response?.status !== 404) return;

  const body = error.response.data as AwesomeErrorBody | undefined;
  if (body?.code !== 'CoinNotExists') return;

  const match = body.message?.match(/([A-Za-z]{3})-([A-Za-z]{3})/);
  if (!match) return;

  const fromCode = from.toLowerCase();
  const left = match[1].toLowerCase();
  const right = match[2].toLowerCase();
  const other =
    left === fromCode ? right : right === fromCode ? left : undefined;

  return other && isAcceptedCurrency(other) ? other : undefined;
};

const invertQuote = (quote: AwesomeQuote): AwesomeQuote | undefined => {
  const ask = Number(quote.ask);
  if (!Number.isFinite(ask) || ask === 0) return undefined;

  const inverted: AwesomeQuote = {
    ask: String(1 / ask),
    timestamp: quote.timestamp,
    create_date: quote.create_date
  };

  const bid = Number(quote.bid);
  if (Number.isFinite(bid) && bid !== 0) inverted.bid = String(1 / bid);

  return inverted;
};

const fetchQuoteBatch = async (
  from: AcceptedCurrencies,
  targets: AcceptedCurrencies[],
  config?: { signal?: AbortSignal }
) => {
  const quotes: AwesomeQuoteMap = {};
  let remaining = [...targets];

  while (remaining.length > 0) {
    const pairs = remaining.map((to) => `${from}-${to}`).join(',');

    try {
      const { data } = await http.get<AwesomeQuoteMap>(
        `/last/${pairs}`,
        config
      );
      Object.assign(quotes, data);
      break;
    } catch (error) {
      if (isAxiosError(error) && error.code === 'ERR_CANCELED') throw error;

      const missing = parseMissingTarget(from, error);
      if (!missing || !remaining.includes(missing)) throw error;

      remaining = remaining.filter((to) => to !== missing);
    }
  }

  return quotes;
};

const fillInverseQuotes = async (
  from: AcceptedCurrencies,
  targets: AcceptedCurrencies[],
  quotes: AwesomeQuoteMap,
  config?: { signal?: AbortSignal }
) => {
  const missing = targets.filter((to) => !quotes[quoteKey(from, to)]);
  if (missing.length === 0) return;

  await Promise.all(
    missing.map(async (to) => {
      try {
        const { data } = await http.get<AwesomeQuoteMap>(
          `/last/${to}-${from}`,
          config
        );
        const inverse = invertQuote(data[quoteKey(to, from)]);
        if (inverse) quotes[quoteKey(from, to)] = inverse;
      } catch (error) {
        if (isAxiosError(error) && error.code === 'ERR_CANCELED') throw error;
      }
    })
  );
};

export const getLastQuotes = async (
  from: AcceptedCurrencies,
  targets: AcceptedCurrencies[],
  config?: { signal?: AbortSignal }
) => {
  const data = await fetchQuoteBatch(from, targets, config);
  await fillInverseQuotes(from, targets, data, config);
  return { data };
};

export const getDailyQuotes = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  days: 7 | 30,
  config?: { signal?: AbortSignal }
) => {
  return http.get<AwesomeQuote[]>(`/json/daily/${from}-${to}/${days}`, config);
};
