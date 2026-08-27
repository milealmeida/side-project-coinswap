export const ACCEPTED_LANGUAGES = ['ptBr', 'en', 'es'] as const;

export type AcceptedLanguages = (typeof ACCEPTED_LANGUAGES)[number];

export const isAcceptedLanguage = (
  value: string | null | undefined
): value is AcceptedLanguages =>
  ACCEPTED_LANGUAGES.includes(value as AcceptedLanguages);
