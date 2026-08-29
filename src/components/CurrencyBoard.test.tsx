import { render, screen, within } from '@testing-library/react';
import { Provider } from 'components/ui/provider';

import 'i18n';

import CurrencyBoard from './CurrencyBoard';

describe('<CurrencyBoard />', () => {
  it('masks known rates and shows a dash when a rate is missing', () => {
    render(
      <Provider>
        <CurrencyBoard
          amountValue="2"
          fromFlag="usd"
          quoteRates={{ usd: 1, eur: 0.9 }}
        />
      </Provider>
    );

    const board = screen.getByTestId('currency-board');

    expect(within(board).getByRole('row', { name: /USD/ })).toHaveTextContent(
      /2/
    );
    expect(within(board).getByRole('row', { name: /EUR/ })).toHaveTextContent(
      /1[,.]80/
    );
    expect(within(board).getByRole('row', { name: /GBP/ })).toHaveTextContent(
      '—'
    );
  });
});
