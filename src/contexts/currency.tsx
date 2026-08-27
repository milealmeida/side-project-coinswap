import { useQuote, type QuoteRates, type QuoteTimes } from 'hooks/useQuote';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { parseShareSearch, syncShareUrl } from 'utils/shareUrl';
import { getNavigatorLanguage, getUserDefaultCurrency } from 'utils/userUtils';

export type CurrencyContextData = {
  currencyValueIn: string;
  currencyValueOut: string;

  currencyFlagIn: AcceptedCurrencies;
  currencyFlagOut: AcceptedCurrencies;

  isLoading: boolean;
  hasError: boolean;
  isStale: boolean;
  quoteRates: QuoteRates;
  quotedAt: QuoteTimes;

  setCurrencyValueIn: (value: string) => void;
  setCurrencyValueOut: (value: string) => void;

  setCurrencyFlagIn: (value: AcceptedCurrencies) => void;
  setCurrencyFlagOut: (value: AcceptedCurrencies) => void;
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValueIn: '',
  currencyValueOut: '',

  currencyFlagIn: 'usd',
  currencyFlagOut: 'eur',

  isLoading: false,
  hasError: false,
  isStale: false,
  quoteRates: {},
  quotedAt: {},

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

const readSharedParams = () =>
  typeof window === 'undefined' ? {} : parseShareSearch(window.location.search);

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValueIn, setCurrencyValueIn] = useState(
    () => readSharedParams().amount ?? '1'
  );
  const [currencyValueOut, setCurrencyValueOut] = useState('');

  const [currencyFlagIn, setCurrencyFlagIn] = useState<AcceptedCurrencies>(
    () => readSharedParams().from ?? getUserDefaultCurrency()
  );
  const [currencyFlagOut, setCurrencyFlagOut] = useState<AcceptedCurrencies>(
    () =>
      readSharedParams().to ?? (getNavigatorLanguage() === 'en' ? 'eur' : 'usd')
  );

  const { quoteRates, quotedAt, isLoading, hasError, isStale, convertedValue } =
    useQuote(currencyFlagIn, currencyFlagOut, currencyValueIn);

  useEffect(() => {
    setCurrencyValueOut(convertedValue);
  }, [convertedValue]);

  useEffect(() => {
    syncShareUrl(currencyFlagIn, currencyFlagOut, currencyValueIn);
  }, [currencyFlagIn, currencyFlagOut, currencyValueIn]);

  return (
    <CurrencyContext.Provider
      value={{
        currencyValueIn,
        currencyValueOut,
        currencyFlagIn,
        currencyFlagOut,
        isLoading,
        hasError,
        isStale,
        quoteRates,
        quotedAt,
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
