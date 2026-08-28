import { AxiosError } from 'axios';

import http from './axios';
import { getDailyQuotes, getLastQuotes } from './queries';

jest.mock('./axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}));

const get = http.get as jest.MockedFunction<typeof http.get>;

const coinNotExists = (pair: string) => {
  const error = new AxiosError('Not Found');
  error.response = {
    status: 404,
    data: { code: 'CoinNotExists', message: pair },
    statusText: 'Not Found',
    headers: {},
    config: error.config!
  };
  return error;
};

describe('getLastQuotes', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('returns a direct USD batch without retry or inverse fetch', async () => {
    get.mockResolvedValueOnce({
      data: {
        USDEUR: { ask: '0.92' },
        USDGBP: { ask: '0.78' }
      }
    });

    const { data } = await getLastQuotes('usd', ['eur', 'gbp']);

    expect(data.USDEUR?.ask).toBe('0.92');
    expect(data.USDGBP?.ask).toBe('0.78');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/last/usd-eur,usd-gbp', undefined);
  });

  it('drops a CoinNotExists pair and retries the smaller batch', async () => {
    get.mockRejectedValueOnce(coinNotExists('JPY-GBP'));
    get.mockResolvedValueOnce({
      data: {
        JPYEUR: { ask: '0.006' }
      }
    });
    get.mockResolvedValueOnce({
      data: {
        GBPJPY: { ask: '0.005', timestamp: '1692619140' }
      }
    });

    const { data } = await getLastQuotes('jpy', ['eur', 'gbp']);

    expect(get).toHaveBeenNthCalledWith(1, '/last/jpy-eur,jpy-gbp', undefined);
    expect(get).toHaveBeenNthCalledWith(2, '/last/jpy-eur', undefined);
    expect(data.JPYEUR?.ask).toBe('0.006');
  });

  it('fills a missing pair from the inverse quote', async () => {
    get.mockImplementation((url) => {
      const path = String(url);
      if (path === '/last/gbp-jpy') {
        return Promise.resolve({
          data: {
            GBPJPY: { ask: '0.005', timestamp: '1692619140' }
          }
        });
      }

      return Promise.resolve({
        data: {
          JPYEUR: { ask: '0.006' }
        }
      });
    });

    const { data } = await getLastQuotes('jpy', ['eur', 'gbp']);

    expect(data.JPYGBP?.ask).toBe(String(1 / 0.005));
    expect(data.JPYGBP?.timestamp).toBe('1692619140');
    expect(get).toHaveBeenCalledWith('/last/gbp-jpy', undefined);
  });

  it('does not fill an inverse when ask is 0', async () => {
    get.mockImplementation((url) => {
      const path = String(url);
      if (path === '/last/gbp-jpy') {
        return Promise.resolve({
          data: {
            GBPJPY: { ask: '0', timestamp: '1' }
          }
        });
      }

      return Promise.resolve({
        data: {
          JPYEUR: { ask: '0.006' }
        }
      });
    });

    const { data } = await getLastQuotes('jpy', ['eur', 'gbp']);

    expect(data.JPYGBP).toBeUndefined();
    expect(data.JPYEUR?.ask).toBe('0.006');
  });

  it('propagates abort without retrying the batch', async () => {
    const aborted = new AxiosError('canceled', 'ERR_CANCELED');
    get.mockRejectedValueOnce(aborted);

    await expect(getLastQuotes('usd', ['eur', 'gbp'])).rejects.toBe(aborted);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('rethrows a 404 that is not CoinNotExists', async () => {
    const error = new AxiosError('Not Found');
    error.response = {
      status: 404,
      data: { code: 'Other', message: 'JPY-GBP' },
      statusText: 'Not Found',
      headers: {},
      config: error.config!
    };
    get.mockRejectedValueOnce(error);

    await expect(getLastQuotes('jpy', ['eur', 'gbp'])).rejects.toBe(error);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('keeps a valid inverse when another inverse fetch fails', async () => {
    get.mockImplementation((url) => {
      const path = String(url);
      if (path === '/last/eur-jpy') {
        return Promise.resolve({
          data: {
            EURJPY: { ask: '160' }
          }
        });
      }
      if (path === '/last/gbp-jpy') {
        return Promise.reject(new AxiosError('Server Error'));
      }
      return Promise.resolve({ data: {} });
    });

    const { data } = await getLastQuotes('jpy', ['eur', 'gbp']);

    expect(data.JPYEUR?.ask).toBe(String(1 / 160));
    expect(data.JPYGBP).toBeUndefined();
  });
});

describe('getDailyQuotes', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('requests the daily path with the given signal', async () => {
    const signal = new AbortController().signal;
    get.mockResolvedValueOnce({ data: [] });

    await getDailyQuotes('usd', 'brl', 30, { signal });

    expect(get).toHaveBeenCalledWith('/json/daily/usd-brl/30', { signal });
  });
});
