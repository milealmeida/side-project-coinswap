import { type AcceptedLanguages } from 'types/acceptedLanguages';

export const getNavigatorLanguage = (): AcceptedLanguages => {
  const language = navigator.language.toLowerCase();

  if (language.startsWith('es')) return 'es';
  if (language.startsWith('pt')) return 'ptBr';

  return 'en';
};

export const toHtmlLang = (language: string): string => {
  const normalized = language.toLowerCase();

  if (normalized.startsWith('pt')) return 'pt-BR';
  if (normalized.startsWith('es')) return 'es';

  return 'en';
};

export const applyDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = toHtmlLang(language);
};

export const getUserDefaultCurrency = () => {
  const data = {
    ptBr: 'brl',
    es: 'eur',
    en: 'usd'
  };

  return data[getNavigatorLanguage()];
};
