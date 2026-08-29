import { render, screen } from '@testing-library/react';
import { Provider } from 'components/ui/provider';

import Avatar from './Avatar';

describe('<Avatar />', () => {
  it('loads the photo from the GitHub CDN and links to github.com', () => {
    render(
      <Provider>
        <Avatar fullName="Milena" githubUsername="milealmeida" />
      </Provider>
    );

    const link = screen.getByRole('link', { name: 'Milena' });
    expect(link).toHaveAttribute('href', 'https://github.com/milealmeida');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.querySelector('img')).toHaveAttribute(
      'src',
      'https://avatars.githubusercontent.com/milealmeida'
    );
  });
});
