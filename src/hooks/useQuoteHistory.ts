import axios from 'axios';
import { useEffect, useState } from 'react';

import { getDailyQuotes } from 'services/queries';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';

export type HistoryRange = 7 | 30;

export type HistoryPoint = {
  date: string;
  rate: number;
};

const formatHistoryDate = (timestamp: string | undefined, locale: string) => {
  const time = Number(timestamp);
  if (!Number.isFinite(time)) return '';

  return new Date(time * 1000).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit'
  });
};

export const useQuoteHistory = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  days: HistoryRange,
  locale: string
) => {
  const [points, setPoints] = useState<HistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (from === to) {
      setPoints([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadHistory = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const { data } = await getDailyQuotes(from, to, days, {
          signal: controller.signal
        });

        const series = [...data]
          .map((quote) => {
            const rate = Number(quote.ask ?? quote.bid);
            const date = formatHistoryDate(quote.timestamp, locale);
            if (!Number.isFinite(rate) || !date) return null;
            return { date, rate, timestamp: Number(quote.timestamp) };
          })
          .filter(
            (point): point is HistoryPoint & { timestamp: number } =>
              point !== null
          )
          .sort((left, right) => left.timestamp - right.timestamp)
          .map(({ date, rate }) => ({ date, rate }));

        setPoints(series);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') return;
        setHasError(true);
        setPoints([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadHistory();

    return () => controller.abort();
  }, [from, to, days, locale]);

  return { points, isLoading, hasError };
};
