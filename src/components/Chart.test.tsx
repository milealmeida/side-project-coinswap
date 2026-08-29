import { render, screen } from '@testing-library/react';
import { Provider } from 'components/ui/provider';

import Chart from './Chart';

const points = [
  { date: '01/01', rate: 5 },
  { date: '02/01', rate: 5.2 }
];

describe('<Chart />', () => {
  it('shows the empty message and no sr-only table', () => {
    render(
      <Provider>
        <Chart
          data={[]}
          summary="USD to BRL over 7 days"
          dateLabel="Date"
          rateLabel="Rate"
          message="Pick two different currencies to see history"
        />
      </Provider>
    );

    expect(
      screen.getByText('Pick two different currencies to see history')
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders a decorative chart and an sr-only data table', () => {
    const { container } = render(
      <Provider>
        <Chart
          data={points}
          summary="USD to BRL over 7 days"
          dateLabel="Date"
          rateLabel="Rate"
        />
      </Provider>
    );

    const table = screen.getByRole('table');
    expect(table.closest('[data-sr-only]')).not.toBeNull();
    expect(table).toHaveTextContent('01/01');
    expect(table).toHaveTextContent('5.2');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
