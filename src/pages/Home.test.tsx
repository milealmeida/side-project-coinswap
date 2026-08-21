import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { CurrencyProvider } from 'contexts/currency.tsx';
import { theme } from 'styles/global';

import 'i18n';

import Home from './Home';

const renderHome = () =>
  render(
    <ChakraProvider theme={theme}>
      <CurrencyProvider>
        <Home />
      </CurrencyProvider>
    </ChakraProvider>
  );

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => {
      return {
        matches: true,
        addListener: jest.fn(),
        removeListener: jest.fn()
      };
    })
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
