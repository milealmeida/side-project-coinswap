import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { getCurrencyFormatted } from 'utils/getCurrencyFormatted';

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

export { maskCurrency, removeCurrencyMask };
