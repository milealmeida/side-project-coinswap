import {
  isAcceptedCurrency,
  type AcceptedCurrencies
} from 'types/acceptedCurrencies';

export type ShareParams = {
  from?: AcceptedCurrencies;
  to?: AcceptedCurrencies;
  amount?: string;
};

const sanitizeShareAmount = (value: string): string | undefined => {
  const cleaned = value.replace(/[^\d,.-]/g, '').slice(0, 11);
  return cleaned || undefined;
};

export const parseShareSearch = (search: string): ShareParams => {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search
  );
  const fromRaw = params.get('from')?.trim().toLowerCase() ?? '';
  const toRaw = params.get('to')?.trim().toLowerCase() ?? '';
  const amountRaw = params.get('amount')?.trim() ?? '';

  return {
    from: isAcceptedCurrency(fromRaw) ? fromRaw : undefined,
    to: isAcceptedCurrency(toRaw) ? toRaw : undefined,
    amount: sanitizeShareAmount(amountRaw)
  };
};

export const buildShareSearch = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  amount: string
) => {
  const params = new URLSearchParams();
  params.set('from', from.toUpperCase());
  params.set('to', to.toUpperCase());
  params.set('amount', amount.trim() || '1');
  return params.toString();
};

export const syncShareUrl = (
  from: AcceptedCurrencies,
  to: AcceptedCurrencies,
  amount: string
) => {
  if (typeof window === 'undefined') return;

  const query = buildShareSearch(from, to, amount);
  const next = `${window.location.pathname}?${query}${window.location.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (current !== next) {
    window.history.replaceState(null, '', next);
  }
};
