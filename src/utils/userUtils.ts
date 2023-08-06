import { type AcceptedLanguages } from 'types/acceptedLanguages';

export const getNavigatorLanguage = (): AcceptedLanguages => {
  if (navigator.language === 'es') return 'es';
  if (navigator.language === 'pt-BR') return 'ptBr';

  return 'en';
};

export const getUserDefaultCurrency = () => {
  const data = {
    ptBr: 'BRL',
    es: 'EUR',
    en: 'USD'
  };

  return data[getNavigatorLanguage()];
};
