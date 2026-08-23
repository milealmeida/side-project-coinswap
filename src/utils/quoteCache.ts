import {
  ACCEPTED_CURRENCIES,
  type AcceptedCurrencies
} from 'types/acceptedCurrencies';

export type CachedRates = Partial<Record<AcceptedCurrencies, number>>;

type CachedQuoteEntry = {
  rates: CachedRates;
  savedAt: number;
};

type QuoteCacheStore = Partial<Record<AcceptedCurrencies, CachedQuoteEntry>>;

const STORAGE_KEY = 'coinswap:quotes:v1';

const sanitizeRates = (
  value: unknown,
  from: AcceptedCurrencies
): CachedRates | null => {
  if (!value || typeof value !== 'object') return null;

  const source = value as Record<string, unknown>;
  const rates: CachedRates = { [from]: 1 };

  ACCEPTED_CURRENCIES.forEach((code) => {
    if (code === from) return;
    const ask = Number(source[code]);
    if (Number.isFinite(ask)) rates[code] = ask;
  });

  return Object.keys(rates).length > 1 ? rates : null;
};

const readStore = (): QuoteCacheStore => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed as QuoteCacheStore;
  } catch {
    return {};
  }
};

export const readQuoteCache = (
  from: AcceptedCurrencies
): CachedRates | null => {
  const entry = readStore()[from];
  return entry ? sanitizeRates(entry.rates, from) : null;
};

const persistStore = (store: QuoteCacheStore) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const writeQuoteCache = (
  from: AcceptedCurrencies,
  rates: CachedRates
) => {
  if (typeof window === 'undefined') return;

  const sanitized = sanitizeRates(rates, from);
  if (!sanitized) return;

  const entry: CachedQuoteEntry = { rates: sanitized, savedAt: Date.now() };

  try {
    persistStore({ ...readStore(), [from]: entry });
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      persistStore({ [from]: entry });
    } catch {
      return;
    }
  }
};
