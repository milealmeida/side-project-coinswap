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

describe('<Home />', () => {
  it('should be able to render title', () => {
    const title = screen.getByTestId('title');

    expect(title).toBeInTheDocument();
  });

  it('should be able to render subtitle', () => {
    const title = screen.getByTestId('subtitle');

    expect(title).toBeInTheDocument();
  });
});
