import { useDebounce } from '@uidotdev/usehooks';
import { maskCurrency, parseAmount } from 'hooks/Masks';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import { getLastQuotes } from 'services/queries';
import { currencyList } from 'utils/currencies';
import { getNavigatorLanguage, getUserDefaultCurrency } from 'utils/userUtils';

export type CurrencyContextData = {
  currencyValueIn: string;
  currencyValueInFormatted: string;
  currencyValueOut: string;

  currencyFlagIn: string;
  currencyFlagOut: string;

  isLoading: boolean;
  hasError: boolean;
  quoteRates: Record<string, number>;

  setCurrencyValueIn: (value: string) => void;
  setCurrencyValueOut: (value: string) => void;

  setCurrencyFlagIn: (value: string) => void;
  setCurrencyFlagOut: (value: string) => void;
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValueIn: '',
  currencyValueInFormatted: '',
  currencyValueOut: '',

  currencyFlagIn: '',
  currencyFlagOut: '',

  isLoading: false,
  hasError: false,
  quoteRates: {},

  setCurrencyValueIn: () => null,
  setCurrencyValueOut: () => null,
  setCurrencyFlagIn: () => null,
  setCurrencyFlagOut: () => null
};

export const CurrencyContext = createContext<CurrencyContextData>(
  CurrencyContextDefaultValues
);

export type CurrencyProviderProps = {
  children: ReactNode;
};

const toAmount = (flag: string, value: string) => parseAmount(flag, value);

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValueIn, setCurrencyValueIn] = useState('1');

  const [currencyValueOut, setCurrencyValueOut] = useState('');

  const [currencyFlagIn, setCurrencyFlagIn] = useState(
    getUserDefaultCurrency()
  );
  const [currencyFlagOut, setCurrencyFlagOut] = useState(
    getNavigatorLanguage() === 'en' ? 'eur' : 'usd'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [quoteRates, setQuoteRates] = useState<Record<string, number>>({});

  const currencyMaskedValue = maskCurrency(
    currencyFlagIn,
    toAmount(currencyFlagIn, currencyValueIn) || 0
  );

  const [currencyValueInFormatted, setCurrencyValueInFormatted] =
    useState(currencyMaskedValue);

  const debouncedValueIn = useDebounce(currencyValueIn, 500);
  const debouncedFlagIn = useDebounce(currencyFlagIn, 500);
  const debouncedFlagOut = useDebounce(currencyFlagOut, 500);

  const applyConvertedValue = (askValue: number | string | undefined) => {
    const amount = toAmount(currencyFlagIn, currencyValueIn);
    const ask = Number(askValue);

    if (!Number.isFinite(amount) || !Number.isFinite(ask)) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setCurrencyValueOut((amount * ask).toFixed(2));
  };

  const handleGetCurrencyValue = async () => {
    const from = debouncedFlagIn.toLowerCase();
    const to = debouncedFlagOut.toLowerCase();
    const isSamePair = from === to;
    const amount = toAmount(from, debouncedValueIn);

    if (!debouncedValueIn.trim() || !Number.isFinite(amount)) return;

    const targets = currencyList
      .map((item) => item.code)
      .filter((code) => code !== from);

    setIsLoading(true);
    setHasError(false);

    try {
      const { data } = await getLastQuotes(from, targets);
      const rates: Record<string, number> = { [from]: 1 };

      targets.forEach((target) => {
        const key = `${from}${target}`.toUpperCase();
        const quote = data[key];
        const ask = Number(quote?.ask);
        if (Number.isFinite(ask)) rates[target] = ask;
      });

      setQuoteRates(rates);

      if (isSamePair) {
        setCurrencyValueOut(amount.toFixed(2));
        setHasError(false);
        return;
      }

      applyConvertedValue(rates[to]);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatValue = () => {
    const amount = toAmount(currencyFlagIn, currencyValueIn);
    setCurrencyValueInFormatted(
      Number.isFinite(amount) ? maskCurrency(currencyFlagIn, amount) : ''
    );
  };

  useEffect(() => {
    handleGetCurrencyValue();
  }, [debouncedValueIn, debouncedFlagIn, debouncedFlagOut]);

  useEffect(() => {
    handleFormatValue();
  }, [currencyValueIn, currencyFlagIn]);

  return (
    <CurrencyContext.Provider
      value={{
        currencyValueIn,
        currencyValueInFormatted,
        currencyValueOut,
        currencyFlagIn,
        currencyFlagOut,
        isLoading,
        hasError,
        quoteRates,
        setCurrencyValueIn,
        setCurrencyValueOut,
        setCurrencyFlagIn,
        setCurrencyFlagOut
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
