import {
  ACCEPTED_CURRENCIES,
  type AcceptedCurrencies
} from 'types/acceptedCurrencies';

export type CachedRates = Partial<Record<AcceptedCurrencies, number>>;
export type CachedQuotedAt = Partial<Record<AcceptedCurrencies, number>>;

export type CachedQuoteSnapshot = {
  rates: CachedRates;
  quotedAt: CachedQuotedAt;
  savedAt?: number;
};

type CachedQuoteEntry = {
  rates: CachedRates;
  quotedAt?: CachedQuotedAt;
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

const sanitizeQuotedAt = (value: unknown): CachedQuotedAt => {
  if (!value || typeof value !== 'object') return {};

  const source = value as Record<string, unknown>;
  const quotedAt: CachedQuotedAt = {};

  ACCEPTED_CURRENCIES.forEach((code) => {
    const time = Number(source[code]);
    if (Number.isFinite(time) && time > 0) quotedAt[code] = time;
  });

  return quotedAt;
};

const sanitizeSavedAt = (value: unknown): number | undefined => {
  const time = Number(value);
  return Number.isFinite(time) && time > 0 ? time : undefined;
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
): CachedQuoteSnapshot | null => {
  const entry = readStore()[from];
  const rates = entry ? sanitizeRates(entry.rates, from) : null;
  if (!rates) return null;

  return {
    rates,
    quotedAt: sanitizeQuotedAt(entry?.quotedAt),
    savedAt: sanitizeSavedAt(entry?.savedAt)
  };
};

const persistStore = (store: QuoteCacheStore) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const writeQuoteCache = (
  from: AcceptedCurrencies,
  rates: CachedRates,
  quotedAt: CachedQuotedAt = {}
) => {
  if (typeof window === 'undefined') return;

  const sanitized = sanitizeRates(rates, from);
  if (!sanitized) return;

  const entry: CachedQuoteEntry = {
    rates: sanitized,
    quotedAt: sanitizeQuotedAt(quotedAt),
    savedAt: Date.now()
  };

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
