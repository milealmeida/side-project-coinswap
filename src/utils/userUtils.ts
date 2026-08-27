import { type AcceptedCurrencies } from 'types/acceptedCurrencies';
import {
  isAcceptedLanguage,
  type AcceptedLanguages
} from 'types/acceptedLanguages';

export const LANGUAGE_STORAGE_KEY = 'language';

export const getNavigatorLanguage = (): AcceptedLanguages => {
  const language = navigator.language.toLowerCase();

  if (language.startsWith('es')) return 'es';
  if (language.startsWith('pt')) return 'ptBr';

  return 'en';
};

export const readStoredLanguage = (): AcceptedLanguages | undefined => {
  if (typeof window === 'undefined') return undefined;

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isAcceptedLanguage(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
};

export const persistLanguage = (language: string) => {
  if (typeof window === 'undefined' || !isAcceptedLanguage(language)) return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    /* ignore */
  }
};

export const getInitialLanguage = (): AcceptedLanguages =>
  readStoredLanguage() ?? getNavigatorLanguage();

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

export const getUserDefaultCurrency = (): AcceptedCurrencies => {
  const data: Record<AcceptedLanguages, AcceptedCurrencies> = {
    ptBr: 'brl',
    es: 'eur',
    en: 'usd'
  };

  return data[getNavigatorLanguage()];
};
