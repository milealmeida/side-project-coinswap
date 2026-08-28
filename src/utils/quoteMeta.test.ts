import { parseQuoteTimestamp } from './quoteMeta';

describe('parseQuoteTimestamp', () => {
  it('converts a unix timestamp in seconds to milliseconds', () => {
    expect(parseQuoteTimestamp({ ask: '1', timestamp: '1692619140' })).toBe(
      1692619140 * 1000
    );
  });

  it('falls back to create_date in Brasília time', () => {
    expect(
      parseQuoteTimestamp({ ask: '1', create_date: '2024-08-21 21:19:00' })
    ).toBe(Date.parse('2024-08-21T21:19:00-03:00'));
  });

  it('returns undefined for missing or invalid quotes', () => {
    expect(parseQuoteTimestamp()).toBeUndefined();
    expect(parseQuoteTimestamp({ ask: '1', timestamp: '0' })).toBeUndefined();
    expect(
      parseQuoteTimestamp({ ask: '1', create_date: 'not-a-date' })
    ).toBeUndefined();
  });
});
