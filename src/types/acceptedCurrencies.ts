export const ACCEPTED_CURRENCIES = [
  'usd',
  'eur',
  'gbp',
  'chf',
  'jpy',
  'brl'
] as const;

export type AcceptedCurrencies = (typeof ACCEPTED_CURRENCIES)[number];

export const isAcceptedCurrency = (
  value: string
): value is AcceptedCurrencies =>
  ACCEPTED_CURRENCIES.includes(value.toLowerCase() as AcceptedCurrencies);
