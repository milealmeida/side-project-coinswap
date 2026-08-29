import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { maskCurrency, parseAmount } from 'hooks/Masks';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { currencyList } from 'utils/currencies';

export type CurrencyBoardProps = {
  amountValue: string;
  fromFlag: AcceptedCurrencies;
  quoteRates: Partial<Record<AcceptedCurrencies, number>>;
};

const CurrencyBoard = ({
  amountValue,
  fromFlag,
  quoteRates
}: CurrencyBoardProps) => {
  const { t: translate } = useTranslation();
  const amount = parseAmount(fromFlag, amountValue);

  return (
    <Box w="100%" maxW="60rem" paddingInline={{ base: '2rem', md: 0 }}>
      <table
        data-testid="currency-board"
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <Box
          as="caption"
          textAlign="start"
          color="textSecondary"
          fontSize="1.4rem"
          fontWeight="500"
          fontStyle="normal"
          mb="0.8rem"
        >
          {translate('allCurrencies')}
        </Box>
        <tbody>
          {currencyList.map((item) => {
            const rate = quoteRates[item.code];
            const converted =
              Number.isFinite(amount) &&
              rate !== undefined &&
              Number.isFinite(rate)
                ? maskCurrency(item.code, amount * rate)
                : '—';

            return (
              <tr key={item.code}>
                <th
                  scope="row"
                  style={{
                    textAlign: 'start',
                    fontWeight: 400,
                    padding: '0.4rem 0'
                  }}
                >
                  <Box as="span" color="textPrimary" fontSize="1.6rem">
                    {item.text}
                  </Box>
                </th>
                <td style={{ textAlign: 'end', padding: '0.4rem 0' }}>
                  <Box as="span" color="textPrimary" fontSize="1.6rem">
                    {converted}
                  </Box>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default CurrencyBoard;
