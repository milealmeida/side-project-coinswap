import { createContext, useContext, useEffect, useState } from 'react';

import { useMutation } from 'react-query';
import { GET_CURRENCY_VALUE } from 'services/queries';

export type CurrencyContextData = {
  currencyValue?: string;
  currency: string;
  currencyIn: string;

  setCurrencyValue: (value: string) => void;
  setCurrency: (value: string) => void;
  setCurrencyIn: (value: string) => void;

  isLoading: boolean;
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValue: undefined,
  currency: '',
  currencyIn: '',

  setCurrencyValue: () => null,
  setCurrency: () => null,
  setCurrencyIn: () => null,

  isLoading: false
};

export const CurrencyContext = createContext<CurrencyContextData>(
  CurrencyContextDefaultValues
);

export type CurrencyProviderProps = {
  children: React.ReactNode;
};

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValue, setCurrencyValue] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyIn, setCurrencyIn] = useState('');

  const { mutateAsync, isLoading } = useMutation(GET_CURRENCY_VALUE);

  useEffect(() => {
    if (currency && currencyIn) {
      mutateAsync(
        { coin: currency.toUpperCase(), coinin: currencyIn.toUpperCase() },
        {
          onSuccess: (response) => {
            const formattedKey = `${currency}${currencyIn}`;
            const askValue = response.data[formattedKey]?.ask;

            setCurrencyValue(askValue);
          }
        }
      );
    }
  }, [currency, currencyIn]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyIn,
        currencyValue,
        setCurrency,
        setCurrencyIn,
        setCurrencyValue,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
