import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';

import { getLastQuotes } from 'services/queries';
import type { AcceptedCurrencies } from 'types/acceptedCurrencies';

import { useQuote } from './useQuote';

jest.mock('@uidotdev/usehooks', () => ({
  useDebounce: (value: unknown) => value
}));

jest.mock('services/queries', () => ({
  getLastQuotes: jest.fn()
}));

const mockGetLastQuotes = getLastQuotes as jest.MockedFunction<
  typeof getLastQuotes
>;

describe('useQuote', () => {
  beforeEach(() => {
    mockGetLastQuotes.mockReset();
  });

  it('converts using the pair ask', async () => {
    mockGetLastQuotes.mockResolvedValue({
      data: {
        USDBRL: { ask: '5', timestamp: '1692619140' }
      }
    });

    const { result } = renderHook(() => useQuote('usd', 'brl', '100'));

    await waitFor(() => {
      expect(result.current.convertedValue).toBe('500.00');
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.quotedAt.brl).toBe(1692619140 * 1000);
    expect(mockGetLastQuotes).toHaveBeenCalled();
  });

  it('does not fetch when the amount is blank', () => {
    renderHook(() => useQuote('usd', 'brl', '   '));

    expect(mockGetLastQuotes).not.toHaveBeenCalled();
  });

  it('errors when the selected pair has no ask', async () => {
    mockGetLastQuotes.mockResolvedValue({
      data: {
        USDEUR: { ask: '0.92' }
      }
    });

    const { result } = renderHook(() => useQuote('usd', 'brl', '100'));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.convertedValue).toBe('');
  });

  it('errors on a network failure', async () => {
    mockGetLastQuotes.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useQuote('usd', 'brl', '100'));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.convertedValue).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('does not flag an error when the in-flight request is aborted', async () => {
    let rejectFirst: ((reason: unknown) => void) | undefined;
    mockGetLastQuotes.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectFirst = reject;
        })
    );
    mockGetLastQuotes.mockResolvedValue({
      data: {
        USDBRL: { ask: '5', timestamp: '1692619140' }
      }
    });

    const { result, rerender } = renderHook(
      ({ to }: { to: AcceptedCurrencies }) => useQuote('usd', to, '100'),
      { initialProps: { to: 'eur' } }
    );

    await waitFor(() => {
      expect(mockGetLastQuotes).toHaveBeenCalled();
    });

    rerender({ to: 'brl' });
    rejectFirst?.(new AxiosError('canceled', 'ERR_CANCELED'));

    await waitFor(() => {
      expect(result.current.convertedValue).toBe('500.00');
    });

    expect(result.current.hasError).toBe(false);
  });

  it('converts the same currency without treating it as a missing rate', async () => {
    mockGetLastQuotes.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useQuote('usd', 'usd', '10'));

    await waitFor(() => {
      expect(result.current.convertedValue).toBe('10.00');
    });

    expect(result.current.hasError).toBe(false);
  });
});
