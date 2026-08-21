import { render, screen } from '@testing-library/react';
import { Provider } from 'components/ui/provider';
import { CurrencyProvider } from 'contexts/currency.tsx';

import 'i18n';

import Home from './Home';

const renderHome = () =>
  render(
    <Provider>
      <CurrencyProvider>
        <Home />
      </CurrencyProvider>
    </Provider>
  );

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
  renderHome();
});

describe('<Home />', () => {
  it('should be able to render title', () => {
    const title = screen.getByTestId('title');

    expect(title).toBeInTheDocument();
  });

  it('should be able to render subtitle', () => {
    const subtitle = screen.getByTestId('subtitle');

    expect(subtitle).toBeInTheDocument();
  });
});
