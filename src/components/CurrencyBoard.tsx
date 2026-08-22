import { Flex, Text } from '@chakra-ui/react';
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
    <Flex
      w="100%"
      maxW="60rem"
      flexDir="column"
      gap="0.8rem"
      paddingInline={{ base: '2rem', md: 0 }}
      data-testid="currency-board"
    >
      <Text color="textSecondary" fontSize="1.4rem" fontWeight="500">
        {translate('allCurrencies')}
      </Text>
      {currencyList.map((item) => {
        const rate = quoteRates[item.code];
        const converted =
          Number.isFinite(amount) && rate !== undefined && Number.isFinite(rate)
            ? maskCurrency(item.code, amount * rate)
            : '—';

        return (
          <Flex
            key={item.code}
            justifyContent="space-between"
            alignItems="center"
            fontSize="1.6rem"
            color="textPrimary"
          >
            <Text>{item.text}</Text>
            <Text>{converted}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default CurrencyBoard;
