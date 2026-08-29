import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'components/ui/provider';
import i18n from 'i18next';

import 'i18n';

import { LANGUAGE_STORAGE_KEY } from 'utils/userUtils';

import Header from './Header';

describe('<Header />', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
    localStorage.clear();
  });

  it('persists the selected language', async () => {
    const user = userEvent.setup();
    await i18n.changeLanguage('ptBr');
    localStorage.clear();

    render(
      <Provider>
        <Header />
      </Provider>
    );

    await user.click(screen.getByLabelText('Selecionar idioma'));
    await user.click(await screen.findByLabelText('English'));

    await waitFor(() => {
      expect(i18n.language).toBe('en');
      expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
      expect(document.documentElement.lang).toBe('en');
    });
  });

  it('toggles the theme button label', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <Header />
      </Provider>
    );

    const toggle = screen.getByRole('button', {
      name: /Switch to (light|dark) theme/
    });
    const initial = toggle.getAttribute('aria-label');

    await user.click(toggle);

    await waitFor(() => {
      expect(toggle).not.toHaveAttribute('aria-label', initial);
    });
  });
});
