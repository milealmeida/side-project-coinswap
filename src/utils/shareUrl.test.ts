import { parseShareSearch } from './shareUrl';

describe('parseShareSearch', () => {
  it('parses a valid share URL', () => {
    expect(parseShareSearch('?from=USD&to=brl&amount=250,50')).toEqual({
      from: 'usd',
      to: 'brl',
      amount: '250,50'
    });
  });

  it('ignores an invalid from currency', () => {
    expect(parseShareSearch('?from=xxx&to=eur&amount=1')).toEqual({
      from: undefined,
      to: 'eur',
      amount: '1'
    });
  });

  it('strips letters from amount and caps it at 11 characters', () => {
    expect(parseShareSearch('?amount=abc12.34567890123')).toEqual({
      from: undefined,
      to: undefined,
      amount: '12.34567890'
    });
  });
});
