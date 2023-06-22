import { render, screen } from '@testing-library/react';
import Home from './Home';

beforeEach(() => {
  render(<Home />);
});

describe('<Home />', () => {
  it('should be able to render title', () => {
    const title = screen.getByRole('heading', { name: /hello world/i });

    expect(title).toBeInTheDocument();
  });
});
