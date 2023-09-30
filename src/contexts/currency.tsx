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

type HandleOnSuccessData = {
  [key: string]: {
    ask: number;
  };
};

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyValueIn, setCurrencyValueIn] = useState('1');
  const [currencyValueOut, setCurrencyValueOut] = useState('');

  const debouncedValueIn = useDebounce(currencyValueIn, 500);

  const [currencyFlagIn, setCurrencyFlagIn] = useState(
    getUserDefaultCurrency()
  );

  const [currencyFlagOut, setCurrencyFlagOut] = useState(
    navigator.language.substring(0, 2) === 'en' ? 'eur' : 'usd'
  );

  const handleOnSuccess = (data: HandleOnSuccessData) => {
    const formattedKey = `${currencyFlagIn}${currencyFlagOut}`.toUpperCase();
    const askValue = data[formattedKey]?.ask;

    const convertedValue = (parseFloat(currencyValueIn) * askValue).toFixed(2);
    setCurrencyValueOut(convertedValue);
  };

  const handleGetCurrencyValue = async () => {
    const regex = /[a-zA-ZÀ-ÖØ-öø-ÿ\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/g;
    const isSpecialChar = regex.test(currencyValueIn);
    if (isSpecialChar) return;

    if (debouncedValueIn && !isSpecialChar) {
      try {
        setIsLoading(true);

        const { data } = await getCurrencyValue({
          coin: currencyFlagIn,
          coinin: currencyFlagOut
        });

        handleOnSuccess(data);
      } catch (error) {
        console.error(`Ops... Something went wrong!`, error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGetCurrencyValue();
  }, [debouncedValueIn]);

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
        // isLoading: false
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
