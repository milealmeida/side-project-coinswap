import { buildShareSearch, parseShareSearch, syncShareUrl } from './shareUrl';

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

describe('buildShareSearch', () => {
  it('uppercases codes and uses 1 when the amount is blank', () => {
    expect(buildShareSearch('usd', 'eur', '  ')).toBe(
      'from=USD&to=EUR&amount=1'
    );
  });
});

describe('syncShareUrl', () => {
  const replaceState = jest.spyOn(window.history, 'replaceState');

  afterEach(() => {
    replaceState.mockClear();
  });

  afterAll(() => {
    replaceState.mockRestore();
  });

  it('does not replaceState when the URL is already in sync', () => {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?from=USD&to=EUR&amount=1${window.location.hash}`
    );
    replaceState.mockClear();

    syncShareUrl('usd', 'eur', '1');

    expect(replaceState).not.toHaveBeenCalled();
  });

  it('preserves the hash when the query changes', () => {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?from=USD&to=EUR&amount=1#keep`
    );
    replaceState.mockClear();

    syncShareUrl('usd', 'brl', '2');

    expect(replaceState).toHaveBeenCalledTimes(1);
    const next = replaceState.mock.calls[0][2] as string;
    expect(next).toContain('from=USD');
    expect(next).toContain('to=BRL');
    expect(next).toContain('amount=2');
    expect(next).toContain('#keep');
  });
});
