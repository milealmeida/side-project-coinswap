import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'components/ui/provider';

import Input from './Input';

describe('<Input />', () => {
  it('opens the currency menu, rotates the chevron, and reports JPY', async () => {
    const user = userEvent.setup();
    const onChangeCurrency = jest.fn();

    render(
      <Provider>
        <Input
          currencyCode="usd"
          value="1"
          onChange={jest.fn()}
          onChangeCurrency={onChangeCurrency}
          currencyAriaLabel="Select currency"
        />
      </Provider>
    );

    const trigger = screen.getByLabelText('Select currency');
    const chevron = trigger.querySelector('[aria-hidden="true"]');

    expect(chevron).toHaveStyle({ transform: 'rotate(0deg)' });

    await user.click(trigger);

    await waitFor(() => {
      expect(chevron).toHaveStyle({ transform: 'rotate(180deg)' });
    });

    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText('JPY'));

    expect(onChangeCurrency).toHaveBeenCalledWith('jpy');
  });
});
