import { render, screen } from '@testing-library/react';
import Home from './Home';

import 'jest-fetch-mock';

beforeEach(() => {
  render(<Home />);
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
