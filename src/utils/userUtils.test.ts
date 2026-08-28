import { LANGUAGE_STORAGE_KEY, getInitialLanguage } from './userUtils';

describe('getInitialLanguage', () => {
  const languageSpy = jest.spyOn(window.navigator, 'language', 'get');

  beforeEach(() => {
    localStorage.clear();
    languageSpy.mockReturnValue('en-US');
  });

  afterAll(() => {
    languageSpy.mockRestore();
  });

  it('maps the browser language to an accepted code', () => {
    languageSpy.mockReturnValue('pt-BR');
    expect(getInitialLanguage()).toBe('ptBr');

    languageSpy.mockReturnValue('es-ES');
    expect(getInitialLanguage()).toBe('es');

    languageSpy.mockReturnValue('en-US');
    expect(getInitialLanguage()).toBe('en');

    languageSpy.mockReturnValue('fr-FR');
    expect(getInitialLanguage()).toBe('en');
  });

  it('prefers a valid stored language over the navigator', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    languageSpy.mockReturnValue('pt-BR');

    expect(getInitialLanguage()).toBe('es');
  });

  it('ignores an invalid stored language', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    languageSpy.mockReturnValue('pt-BR');

    expect(getInitialLanguage()).toBe('ptBr');
  });
});
