import {
  LANGUAGE_STORAGE_KEY,
  getInitialLanguage,
  getUserDefaultCurrency,
  persistLanguage,
  toHtmlLang
} from './userUtils';

const languageSpy = jest.spyOn(window.navigator, 'language', 'get');

beforeEach(() => {
  localStorage.clear();
  languageSpy.mockReturnValue('en-US');
});

afterAll(() => {
  languageSpy.mockRestore();
});

describe('getInitialLanguage', () => {
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

describe('persistLanguage', () => {
  it('stores only accepted language codes', () => {
    persistLanguage('fr');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();

    persistLanguage('ptBr');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('ptBr');
  });
});

describe('toHtmlLang and getUserDefaultCurrency', () => {
  it('maps language codes to html lang and default currency', () => {
    expect(toHtmlLang('ptBr')).toBe('pt-BR');
    expect(toHtmlLang('es')).toBe('es');
    expect(toHtmlLang('en')).toBe('en');

    languageSpy.mockReturnValue('pt-BR');
    expect(getUserDefaultCurrency()).toBe('brl');

    languageSpy.mockReturnValue('es-ES');
    expect(getUserDefaultCurrency()).toBe('eur');

    languageSpy.mockReturnValue('en-US');
    expect(getUserDefaultCurrency()).toBe('usd');
  });
});
