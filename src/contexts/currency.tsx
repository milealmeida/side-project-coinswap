import { useQuote, type QuoteRates } from 'hooks/useQuote';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { getNavigatorLanguage, getUserDefaultCurrency } from 'utils/userUtils';

export type CurrencyContextData = {
  currencyValueIn: string;
  currencyValueOut: string;

  currencyFlagIn: AcceptedCurrencies;
  currencyFlagOut: AcceptedCurrencies;

  isLoading: boolean;
  hasError: boolean;
  quoteRates: QuoteRates;

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

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValueIn, setCurrencyValueIn] = useState('1');
  const [currencyValueOut, setCurrencyValueOut] = useState('');

  const [currencyFlagIn, setCurrencyFlagIn] = useState<AcceptedCurrencies>(
    getUserDefaultCurrency()
  );
  const [currencyFlagOut, setCurrencyFlagOut] = useState<AcceptedCurrencies>(
    getNavigatorLanguage() === 'en' ? 'eur' : 'usd'
  );

  const { quoteRates, isLoading, hasError, convertedValue } = useQuote(
    currencyFlagIn,
    currencyFlagOut,
    currencyValueIn
  );

  useEffect(() => {
    if (convertedValue === '') return;
    setCurrencyValueOut(convertedValue);
  }, [convertedValue]);

  return (
    <CurrencyContext.Provider
      value={{
        currencyValueIn,
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
