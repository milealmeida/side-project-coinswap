import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { parseAmount } from 'hooks/Masks';
import { useEffect, useState } from 'react';

import { getLastQuotes } from 'services/queries';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { currencyList } from 'utils/currencies';
import {
  readQuoteCache,
  writeQuoteCache,
  type CachedQuotedAt
} from 'utils/quoteCache';
import { parseQuoteTimestamp } from 'utils/quoteMeta';

export type QuoteRates = Partial<Record<AcceptedCurrencies, number>>;
export type QuoteTimes = CachedQuotedAt;

const convertAmount = (
  rates: QuoteRates,
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  amount: number
) => {
  if (from === to) return amount.toFixed(2);

  const ask = rates[to];
  if (ask === undefined || !Number.isFinite(ask)) return null;

  return (amount * ask).toFixed(2);
};

export const useQuote = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  amountValue: string
) => {
  const [quoteRates, setQuoteRates] = useState<QuoteRates>({});
  const [quotedAt, setQuotedAt] = useState<QuoteTimes>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [convertedValue, setConvertedValue] = useState('');

  const debouncedFrom = useDebounce(from, 500);
  const debouncedTo = useDebounce(to, 500);
  const debouncedAmountValue = useDebounce(amountValue, 500);

  useEffect(() => {
    const amount = parseAmount(debouncedFrom, debouncedAmountValue);

    if (!debouncedAmountValue.trim() || !Number.isFinite(amount)) return;

    const applyRates = (
      rates: QuoteRates,
      times: QuoteTimes,
      stale: boolean
    ) => {
      const converted = convertAmount(
        rates,
        debouncedFrom,
        debouncedTo,
        amount
      );
      if (converted === null) return false;

      setQuoteRates(rates);
      setQuotedAt(times);
      setConvertedValue(converted);
      setHasError(false);
      setIsStale(stale);
      return true;
    };

    const cached = readQuoteCache(debouncedFrom);
    if (cached) applyRates(cached.rates, cached.quotedAt, false);

    const restoreCachedQuote = () => {
      const fallback = cached ?? readQuoteCache(debouncedFrom);
      if (fallback && applyRates(fallback.rates, fallback.quotedAt, true)) {
        return true;
      }
      setHasError(true);
      setIsStale(false);
      return false;
    };

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      restoreCachedQuote();
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const targets = currencyList
      .map((item) => item.code)
      .filter((code) => code !== debouncedFrom);

    const loadQuotes = async () => {
      setIsLoading(true);
      setHasError(false);
      setIsStale(false);

      try {
        const { data } = await getLastQuotes(debouncedFrom, targets, {
          signal: controller.signal
        });

        const rates: QuoteRates = { [debouncedFrom]: 1 };
        const times: QuoteTimes = {};

        targets.forEach((target) => {
          const key = `${debouncedFrom}${target}`.toUpperCase();
          const quote = data[key];
          const ask = Number(quote?.ask);
          if (Number.isFinite(ask)) rates[target] = ask;

          const quotedTime = parseQuoteTimestamp(quote);
          if (quotedTime !== undefined) times[target] = quotedTime;
        });

        if (!applyRates(rates, times, false)) {
          setHasError(true);
          return;
        }

        writeQuoteCache(debouncedFrom, rates, times);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') return;
        restoreCachedQuote();
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadQuotes();

    return () => controller.abort();
  }, [debouncedFrom, debouncedTo, debouncedAmountValue]);

  return {
    quoteRates,
    quotedAt,
    isLoading,
    hasError,
    isStale,
    convertedValue
  };
};
