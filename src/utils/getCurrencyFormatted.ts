import { AcceptedCurrencies } from 'types/acceptedCurrencies';

export const getCurrencyFormatted = (currency: AcceptedCurrencies) => {
  const currencies = {
    usd: {
      id: 1,
      country: 'en-US',
      currency: 'USD' // Dólar Americano (Estados Unidos)
    },
    eur: {
      id: 2,
      country: 'de-DE',
      currency: 'EUR' // Euro (União Europeia e outros países)
    },
    gbp: {
      id: 3,
      country: 'en-GB',
      currency: 'GBP' // Libra Esterlina (Reino Unido)
    },
    chf: {
      id: 4,
      country: 'fr-CH',
      currency: 'CHF' // Franco Suíço (Suíça)
    },
    jpy: {
      id: 5,
      country: 'ja-JP',
      currency: 'JPY' // Iene Japonês (Japão)
    },
    brl: {
      id: 6,
      country: 'pt-BR',
      currency: 'BRL' // Real Brasileiro (Brasil)
    }
  };

  return currencies[currency];
};
