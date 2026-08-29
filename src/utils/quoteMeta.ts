import { AwesomeQuote } from 'types/awesomeQuote';

export const parseQuoteTimestamp = (
  quote?: AwesomeQuote
): number | undefined => {
  if (!quote) return undefined;

  const unix = Number(quote.timestamp);
  if (Number.isFinite(unix) && unix > 0) return unix * 1000;

  if (!quote.create_date) return undefined;

  const parsed = Date.parse(`${quote.create_date.replace(' ', 'T')}-03:00`);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const formatQuoteStamp = (ms: number, locale: string) => {
  const date = new Date(ms);
  const includeYear = date.getUTCFullYear() !== new Date().getUTCFullYear();

  const datePart = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' as const } : {}),
    timeZone: 'UTC'
  }).format(date);

  const timePart = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC'
  }).format(date);

  return `${datePart}, ${timePart} UTC`;
};
