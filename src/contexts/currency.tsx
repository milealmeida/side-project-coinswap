import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import { useMutation } from 'react-query';
import { getCurrencyValue } from 'services/queries';
import { getUserDefaultCurrency } from 'utils/userUtils';

export type CurrencyContextData = {
  currencyValueIn: string;
  currencyValueOut: string;

  currencyFlagIn: string;
  currencyFlagOut: string;

  setCurrencyValueIn: (value: string) => void;
  setCurrencyValueOut: (value: string) => void;

  setCurrencyFlagIn: (value: string) => void;
  setCurrencyFlagOut: (value: string) => void;

  isLoading: boolean;
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValueIn: '',
  currencyValueOut: '',

  currencyFlagIn: '',
  currencyFlagOut: '',

  setCurrencyValueIn: () => null,
  setCurrencyValueOut: () => null,
  setCurrencyFlagIn: () => null,
  setCurrencyFlagOut: () => null,

  isLoading: false
};

export const CurrencyContext = createContext<CurrencyContextData>(
  CurrencyContextDefaultValues
);

export type CurrencyProviderProps = {
  children: ReactNode;
};

type OnSuccessData = {
  [key: string]: {
    ask: number;
  };
};

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyValueIn, setCurrencyValueIn] = useState('1');
  const [currencyValueOut, setCurrencyValueOut] = useState('');

  const [currencyFlagIn, setCurrencyFlagIn] = useState(
    getUserDefaultCurrency()
  );

  const [currencyFlagOut, setCurrencyFlagOut] = useState(
    navigator.language === 'en' ? 'eur' : 'usd'
  );

  const { mutateAsync, isLoading } = useMutation(getCurrencyValue);

  const onSuccess = (data: OnSuccessData) => {
    const formattedKey = `${currencyFlagIn}${currencyFlagOut}`.toUpperCase();

    const askValue = data[formattedKey]?.ask;

    const convertedValue = (parseFloat(currencyValueIn) * askValue).toFixed(2);
    setCurrencyValueOut(convertedValue);
  };

  useEffect(() => {
    mutateAsync(
      { coin: currencyFlagIn, coinin: currencyFlagOut },
      { onSuccess: (response) => onSuccess(response.data) }
    );
  }, [currencyFlagIn, currencyFlagOut, currencyValueIn]);

  return (
    <CurrencyContext.Provider
      value={{
        currencyValueIn,
        currencyValueOut,
        currencyFlagIn,
        currencyFlagOut,
        setCurrencyValueIn,
        setCurrencyValueOut,
        setCurrencyFlagIn,
        setCurrencyFlagOut,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
