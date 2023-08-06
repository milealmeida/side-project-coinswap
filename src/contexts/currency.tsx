import { createContext, useContext, useEffect, useState } from 'react';
import { getUserDefaultCurrency } from 'utils/userUtils';

import { useMutation } from 'react-query';
import { GET_CURRENCY_VALUE } from 'services/queries';

export type CurrencyContextData = {
  currencyValue?: string;
  currency: string;
  currencyIn: string;

  setCurrencyValue: (value: string) => void;
  setCurrency: (value: string) => void;
  setCurrencyIn: (value: string) => void;
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValue: undefined,
  currency: '',
  currencyIn: '',

  setCurrencyValue: () => null,
  setCurrency: () => null,
  setCurrencyIn: () => null
};

export const CurrencyContext = createContext<CurrencyContextData>(
  CurrencyContextDefaultValues
);

export type CurrencyProviderProps = {
  children: React.ReactNode;
};

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValue, setCurrencyValue] = useState('');
  const [currency, setCurrency] = useState(getUserDefaultCurrency());
  const [currencyIn, setCurrencyIn] = useState('');

  const { mutateAsync } = useMutation(GET_CURRENCY_VALUE);

  useEffect(() => {
    mutateAsync(
      { coin: currency, coinin: currencyIn },
      {
        onSuccess: (ctx) => {
          const formattedKey = `${currency}${currencyIn}`;
          const askValue = ctx.data[formattedKey]?.ask;

          setCurrencyValue(askValue);
        }
      }
    );
  }, [currency, currencyIn]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyIn,
        currencyValue,
        setCurrency,
        setCurrencyIn,
        setCurrencyValue
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);