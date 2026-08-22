import { brl, chf, eur, gbp, jpy, usd } from 'assets/img';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';

export type CurrencyMeta = {
  code: AcceptedCurrencies;
  country: string;
  currency: string;
  src: string;
  alt: string;
  text: string;
};

export const CURRENCIES: Record<AcceptedCurrencies, CurrencyMeta> = {
  usd: {
    code: 'usd',
    country: 'en-US',
    currency: 'USD',
    src: usd,
    alt: 'USD',
    text: 'USD'
  },
  eur: {
    code: 'eur',
    country: 'de-DE',
    currency: 'EUR',
    src: eur,
    alt: 'EUR',
    text: 'EUR'
  },
  gbp: {
    code: 'gbp',
    country: 'en-GB',
    currency: 'GBP',
    src: gbp,
    alt: 'GBP',
    text: 'GBP'
  },
  chf: {
    code: 'chf',
    country: 'fr-CH',
    currency: 'CHF',
    src: chf,
    alt: 'CHF',
    text: 'CHF'
  },
  jpy: {
    code: 'jpy',
    country: 'ja-JP',
    currency: 'JPY',
    src: jpy,
    alt: 'JPY',
    text: 'JPY'
  },
  brl: {
    code: 'brl',
    country: 'pt-BR',
    currency: 'BRL',
    src: brl,
    alt: 'BRL',
    text: 'BRL'
  }
};

export const currencyList: CurrencyMeta[] = [
  CURRENCIES.usd,
  CURRENCIES.eur,
  CURRENCIES.gbp,
  CURRENCIES.chf,
  CURRENCIES.jpy,
  CURRENCIES.brl
];

export const getCurrencyFormatted = (currency: string) => {
  return CURRENCIES[currency.toLowerCase() as AcceptedCurrencies];
};
