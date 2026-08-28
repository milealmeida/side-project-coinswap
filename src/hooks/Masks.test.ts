import { maskCurrency, parseAmount } from './Masks';

describe('parseAmount', () => {
  it('parses BRL thousands and comma decimals', () => {
    expect(parseAmount('brl', '1.234,56')).toBe(1234.56);
  });

  it('parses USD thousands and dot decimals', () => {
    expect(parseAmount('usd', '1,234.56')).toBe(1234.56);
  });

  it('returns NaN for a blank string', () => {
    expect(Number.isNaN(parseAmount('usd', '   '))).toBe(true);
  });

  it('parses JPY as a whole number', () => {
    expect(parseAmount('jpy', '1500')).toBe(1500);
  });
});

describe('maskCurrency', () => {
  it('formats JPY with the ja-JP currency locale', () => {
    const expected = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(1500);

    expect(maskCurrency('jpy', 1500)).toBe(expected);
  });
});
