import { render, screen } from '@testing-library/react';
import Home from './Home';

import 'jest-fetch-mock';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'services/queryClient.ts';

beforeEach(() => {
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
});

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
