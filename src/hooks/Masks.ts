import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { getCurrencyFormatted } from 'utils/currencies';

const maskCurrency = (currencyFlag: string, currencyValue: number) => {
  const { country, currency } = getCurrencyFormatted(
    currencyFlag.toLowerCase() as AcceptedCurrencies
  );

  const currencyFormatted = new Intl.NumberFormat(country, {
    style: 'currency',
    currency
  }).format(currencyValue);

  return currencyFormatted;
};

const parseLooseAmount = (value: string): number => {
  const cleaned = value.replace(/[^\d,.-]/g, '');
  if (!cleaned) return NaN;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const normalized =
    lastComma > lastDot
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(/,/g, '');

  return parseFloat(normalized);
};

const parseAmount = (currencyFlag: string, value: string): number => {
  const trimmed = value.trim();
  if (!trimmed) return NaN;

  if (/^[\d.,-]+$/.test(trimmed)) {
    return parseLooseAmount(trimmed);
  }

  const locale = getCurrencyFormatted(
    currencyFlag.toLowerCase() as AcceptedCurrencies
  );

  if (!locale) return parseLooseAmount(trimmed);

  const parsed = removeCurrencyMask({
    country: locale.country,
    currency: locale.currency,
    money: trimmed
  });

  return Number.isFinite(parsed) ? parsed : parseLooseAmount(trimmed);
};

function removeCurrencyMask({
  country,
  currency,
  money
}: {
  country: string;
  currency: string;
  money: string;
}) {
  const separatorDecimal = new Intl.NumberFormat(country, {
    style: 'decimal'
  })
    .format(11.11)
    .replace(/\d/g, '');

  const separatorThousands = new Intl.NumberFormat(country, {
    style: 'decimal'
  })
    .format(1111)
    .replace(/\d/g, '');

  const symbolOnLeft = new Intl.NumberFormat(country, {
    style: 'currency',
    currency
  })
    .format(1)
    .replace(
      new RegExp(`\\d|[${separatorDecimal}${separatorThousands}]*`, 'g'),
      ''
    );

  const stringNumber = money
    .replace(new RegExp(`[${separatorThousands}]`, 'g'), '')
    .replace(separatorDecimal, '.')
    .replace(new RegExp(`[${symbolOnLeft}]`, 'g'), '');

  return parseFloat(stringNumber);
}

export { maskCurrency, parseAmount, removeCurrencyMask };
