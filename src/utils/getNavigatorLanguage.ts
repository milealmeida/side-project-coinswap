export const getNavigatorLanguage = () => {
  if (navigator.language === 'es') return 'es';
  if (navigator.language === 'pt-BR') return 'ptBr';

  return 'en';
};
