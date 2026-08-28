import { renderHook, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';

import { getDailyQuotes } from 'services/queries';
import type { AwesomeQuote } from 'types/awesomeQuote';

import { useQuoteHistory } from './useQuoteHistory';

jest.mock('services/queries', () => ({
  getDailyQuotes: jest.fn()
}));

const mockGetDailyQuotes = getDailyQuotes as jest.MockedFunction<
  typeof getDailyQuotes
>;

const jan1 = 1704067200;
const jan2 = 1704153600;

const historyDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit'
  });

describe('useQuoteHistory', () => {
  beforeEach(() => {
    mockGetDailyQuotes.mockReset();
  });

  it('does not fetch when the pair is the same currency', () => {
    const { result } = renderHook(() =>
      useQuoteHistory('usd', 'usd', 7, 'en-US')
    );

    expect(mockGetDailyQuotes).not.toHaveBeenCalled();
    expect(result.current.points).toEqual([]);
    expect(result.current.hasError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('filters invalid points and sorts the series ascending', async () => {
    mockGetDailyQuotes.mockResolvedValue({
      data: [
        { ask: '5.2', timestamp: String(jan2) },
        { ask: '5.0', timestamp: String(jan1) },
        { ask: 'nope', timestamp: '1704240000' },
        { ask: '5.1' }
      ]
    } as AxiosResponse<AwesomeQuote[]>);

    const { result } = renderHook(() =>
      useQuoteHistory('usd', 'brl', 7, 'en-US')
    );

    await waitFor(() => {
      expect(result.current.points).toEqual([
        { date: historyDate(jan1), rate: 5 },
        { date: historyDate(jan2), rate: 5.2 }
      ]);
    });

    expect(result.current.hasError).toBe(false);
  });
});
