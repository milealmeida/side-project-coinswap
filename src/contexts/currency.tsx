import { useDebounce } from '@uidotdev/usehooks';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

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
};

export const CurrencyContextDefaultValues: CurrencyContextData = {
  currencyValueIn: '',
  currencyValueOut: '',

  currencyFlagIn: '',
  currencyFlagOut: '',

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

type HandleOnSuccessData = {
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
    navigator.language.substring(0, 2) === 'en' ? 'eur' : 'usd'
  );

  const debouncedValueIn = useDebounce(currencyValueIn, 500);
  const debouncedFlagIn = useDebounce(currencyFlagIn, 500);
  const debouncedFlagOut = useDebounce(currencyFlagOut, 500);

  const handleOnSuccess = (data: HandleOnSuccessData) => {
    const formattedKey = `${currencyFlagIn}${currencyFlagOut}`.toUpperCase();
    const askValue = data[formattedKey]?.ask;

    const formattedCurrencyValueIn = currencyValueIn
      .replace(/[^0-9,\.]/g, '')
      .replace(',', '.');

    const convertedValue = (
      parseFloat(formattedCurrencyValueIn) * askValue
    ).toFixed(2);
    setCurrencyValueOut(convertedValue);
  };

  const handleGetCurrencyValue = async () => {
    const formattedValue = debouncedValueIn
      .replace(/[^0-9,\.]/g, '')
      .replace(',', '.');

    const hasValidValue = formattedValue || debouncedFlagIn || debouncedFlagOut;
    if (hasValidValue) {
      try {
        const { data } = await getCurrencyValue({
          coin: currencyFlagIn.toLowerCase(),
          coinin: currencyFlagOut.toLowerCase()
        });

        handleOnSuccess(data);
      } catch (error) {
        console.error(`Ops... Something went wrong!`, error);
      }
    }
  };

  useEffect(() => {
    handleGetCurrencyValue();
  }, [debouncedValueIn, debouncedFlagIn, debouncedFlagOut]);

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
        setCurrencyFlagOut
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
