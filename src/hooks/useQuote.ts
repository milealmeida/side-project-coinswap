import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { parseAmount } from 'hooks/Masks';
import { useEffect, useState } from 'react';

import { getLastQuotes } from 'services/queries';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { currencyList } from 'utils/currencies';

export type QuoteRates = Partial<Record<AcceptedCurrencies, number>>;

export const useQuote = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  amountValue: string
) => {
  const [quoteRates, setQuoteRates] = useState<QuoteRates>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [convertedValue, setConvertedValue] = useState('');

  const debouncedFrom = useDebounce(from, 500);
  const debouncedTo = useDebounce(to, 500);
  const debouncedAmountValue = useDebounce(amountValue, 500);

  useEffect(() => {
    const amount = parseAmount(debouncedFrom, debouncedAmountValue);

    if (!debouncedAmountValue.trim() || !Number.isFinite(amount)) return;

    const controller = new AbortController();
    const targets = currencyList
      .map((item) => item.code)
      .filter((code) => code !== debouncedFrom);

    const loadQuotes = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const { data } = await getLastQuotes(debouncedFrom, targets, {
          signal: controller.signal
        });

        const rates: QuoteRates = { [debouncedFrom]: 1 };

        targets.forEach((target) => {
          const key = `${debouncedFrom}${target}`.toUpperCase();
          const ask = Number(data[key]?.ask);
          if (Number.isFinite(ask)) rates[target] = ask;
        });

        setQuoteRates(rates);

        if (debouncedFrom === debouncedTo) {
          setConvertedValue(amount.toFixed(2));
          return;
        }

        const ask = rates[debouncedTo];
        if (ask === undefined || !Number.isFinite(ask)) {
          setHasError(true);
          return;
        }

        setConvertedValue((amount * ask).toFixed(2));
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') return;
        setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadQuotes();

    return () => controller.abort();
  }, [debouncedFrom, debouncedTo, debouncedAmountValue]);

  return { quoteRates, isLoading, hasError, convertedValue };
};
