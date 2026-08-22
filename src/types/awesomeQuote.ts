export type AwesomeQuote = {
  ask: string;
  bid?: string;
  pctChange?: string;
  create_date?: string;
};

export type AwesomeQuoteMap = Record<string, AwesomeQuote>;
