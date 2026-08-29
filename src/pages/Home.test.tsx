import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AxiosResponse } from 'axios';
import { Provider } from 'components/ui/provider';
import { CurrencyProvider } from 'contexts/currency.tsx';
import { getDailyQuotes, getLastQuotes } from 'services/queries';
import type { AwesomeQuote } from 'types/awesomeQuote';

import 'i18n';

import { copyText } from 'utils/clipboard';
import { formatQuoteStamp } from 'utils/quoteMeta';

import Home from './Home';

jest.mock('@uidotdev/usehooks', () => ({
  useDebounce: (value: unknown) => value
}));

jest.mock('services/queries', () => ({
  getLastQuotes: jest.fn(),
  getDailyQuotes: jest.fn()
}));

jest.mock('utils/clipboard', () => ({
  copyText: jest.fn(() => Promise.resolve())
}));

const mockGetLastQuotes = getLastQuotes as jest.MockedFunction<
  typeof getLastQuotes
>;
const mockGetDailyQuotes = getDailyQuotes as jest.MockedFunction<
  typeof getDailyQuotes
>;
const mockCopyText = copyText as jest.MockedFunction<typeof copyText>;

const QUOTE_TIMESTAMP = '1692619140';

const quotesFor = (from: string, askByTo: Record<string, string>) => {
  const data: Record<string, { ask: string; timestamp: string }> = {};
  Object.entries(askByTo).forEach(([to, ask]) => {
    data[`${from}${to}`.toUpperCase()] = {
      ask,
      timestamp: QUOTE_TIMESTAMP
    };
  });
  return { data };
};

const defaultAsks = {
  usd: '1',
  eur: '0.92',
  gbp: '0.78',
  chf: '0.88',
  jpy: '150',
  brl: '5'
};

const mountHome = () =>
  render(
    <Provider>
      <CurrencyProvider>
        <Home />
      </CurrencyProvider>
    </Provider>
  );

const renderHome = async () => {
  const view = mountHome();
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeEnabled();
  });
  return view;
};

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
});

beforeEach(() => {
  localStorage.clear();
  mockCopyText.mockResolvedValue(undefined);
  mockGetLastQuotes.mockImplementation(async (from) =>
    quotesFor(
      from,
      Object.fromEntries(
        Object.entries(defaultAsks).filter(([code]) => code !== from)
      )
    )
  );
  mockGetDailyQuotes.mockResolvedValue({
    data: []
  } as unknown as AxiosResponse<AwesomeQuote[]>);
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('<Home />', () => {
  it('should be able to render title', async () => {
    await renderHome();
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });

  it('should be able to render subtitle', async () => {
    await renderHome();
    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
  });

  it('shows an error when both currencies are the same', async () => {
    const user = userEvent.setup();
    await renderHome();

    await user.click(screen.getByLabelText('Select currency, current EUR'));
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText('USD'));

    expect(
      await screen.findByText('The inputs cannot be the same')
    ).toHaveAttribute('role', 'alert');
    expect(
      screen.getByText('Pick two different currencies to see history')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('quote-rate')).not.toBeInTheDocument();
  });

  it('resets a blank amount to 1 on blur', async () => {
    const user = userEvent.setup();
    const replaceState = jest.spyOn(window.history, 'replaceState');
    await renderHome();

    const amount = screen.getByLabelText('Amount in USD');
    await user.click(amount);
    await user.clear(amount);
    await user.tab();

    await waitFor(() => {
      expect(amount).not.toHaveValue('');
    });
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('amount=1')
    );
    replaceState.mockRestore();
  });

  it('swaps currencies and updates the share URL', async () => {
    const user = userEvent.setup();
    const replaceState = jest.spyOn(window.history, 'replaceState');
    await renderHome();

    const amount = screen.getByLabelText('Amount in USD');
    await user.click(amount);
    await user.clear(amount);
    await user.type(amount, '100');

    await waitFor(() => {
      expect(screen.getByLabelText('Converted amount in EUR')).not.toHaveValue(
        ''
      );
    });

    replaceState.mockClear();
    await user.click(screen.getByLabelText('Swap currencies'));

    await waitFor(() => {
      expect(
        screen.getByLabelText('Select currency, current EUR')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Select currency, current USD')
      ).toBeInTheDocument();
    });

    const lastCall =
      replaceState.mock.calls[replaceState.mock.calls.length - 1];
    const next = lastCall?.[2] as string;
    expect(next).toContain('from=EUR');
    expect(next).toContain('to=USD');
    replaceState.mockRestore();
  });

  it('shows loading then a request error and disables copy', async () => {
    let rejectQuotes: ((reason: unknown) => void) | undefined;
    mockGetLastQuotes.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectQuotes = reject;
        })
    );

    mountHome();

    expect(await screen.findByTestId('loading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeDisabled();

    rejectQuotes?.(new Error('network'));

    expect(await screen.findByTestId('request-error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeDisabled();
  });

  it('shows the quote timestamp stamp', async () => {
    await renderHome();

    const stamp = await screen.findByTestId('quote-rate');
    expect(stamp).toHaveTextContent(
      formatQuoteStamp(Number(QUOTE_TIMESTAMP) * 1000, 'en')
    );
    expect(stamp).toHaveTextContent('AwesomeAPI');
  });

  it('copies the conversion summary', async () => {
    const user = userEvent.setup();
    await renderHome();

    const copy = screen.getByRole('button', { name: 'Copy result' });
    expect(copy).toBeEnabled();

    await user.click(copy);

    expect(mockCopyText).toHaveBeenCalled();
    await waitFor(() => {
      expect(copy).toHaveTextContent('Copied');
    });
  });

  it('requests 30-day history when the range is changed', async () => {
    const user = userEvent.setup();
    await renderHome();

    await user.click(screen.getByRole('button', { name: '30 days' }));

    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await waitFor(() => {
      expect(mockGetDailyQuotes).toHaveBeenCalledWith(
        'usd',
        'eur',
        30,
        expect.anything()
      );
    });
  });

  it('reads shared URL params on mount', async () => {
    window.history.replaceState(null, '', '/?from=jpy&to=usd&amount=10');
    await renderHome();

    expect(screen.getByLabelText('Amount in JPY')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Select currency, current JPY')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Select currency, current USD')
    ).toBeInTheDocument();
  });

  it('strips letters, caps the amount at 11 characters, and drops a leading zero', async () => {
    const user = userEvent.setup();
    await renderHome();

    const amount = screen.getByLabelText('Amount in USD');
    await user.click(amount);
    await user.clear(amount);
    await user.type(amount, 'abc123456789012');

    expect(amount).toHaveValue('12345678901');

    await user.clear(amount);
    await user.type(amount, '01');

    expect(amount).toHaveValue('1');
  });
});
