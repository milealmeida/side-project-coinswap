import { useDebounce } from '@uidotdev/usehooks';
import { maskCurrency, parseAmount } from 'hooks/Masks';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import { getCurrencyValue } from 'services/queries';
import { getNavigatorLanguage, getUserDefaultCurrency } from 'utils/userUtils';

export type CurrencyContextData = {
  currencyValueIn: string;
  currencyValueInFormatted: string;
  currencyValueOut: string;

  currencyFlagIn: string;
  currencyFlagOut: string;

  isLoading: boolean;
  hasError: boolean;

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
    ask: number | string;
  };
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

  const handleOnSuccess = (data: HandleOnSuccessData) => {
    const formattedKey = `${currencyFlagIn}${currencyFlagOut}`.toUpperCase();
    const quote = data[formattedKey] ?? Object.values(data)[0];

    applyConvertedValue(quote?.ask);
  };

  const handleGetCurrencyValue = async () => {
    const isSamePair =
      debouncedFlagIn.toLowerCase() === debouncedFlagOut.toLowerCase();

    if (isSamePair) {
      const amount = toAmount(debouncedFlagIn, debouncedValueIn);
      setCurrencyValueOut(Number.isFinite(amount) ? amount.toFixed(2) : '');
      setHasError(false);
      setIsLoading(false);
      return;
    }

    if (!debouncedValueIn.trim()) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const { data } = await getCurrencyValue({
        coin: currencyFlagIn.toLowerCase(),
        coinin: currencyFlagOut.toLowerCase()
      });

      handleOnSuccess(data);
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
