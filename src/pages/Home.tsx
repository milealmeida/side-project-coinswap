import { Box, Flex, Heading, Image, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Chart, Footer, Header, Input } from 'components';
import { dark, light } from 'styles/global';
import { arrowExchange } from 'assets/img';
import { useCurrency } from 'contexts/currency';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const { t: translate } = useTranslation();
  const {
    currencyValueIn,
    currencyValueOut,
    currencyFlagIn,
    currencyFlagOut,
    setCurrencyFlagIn,
    setCurrencyFlagOut,
    setCurrencyValueIn
  } = useCurrency();

  return (
    <Box
      bg={colors.bgColor}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDir="column"
      height="100vh"
    >
      <Header />
      <Heading color="primary" data-testid="title">
        {translate('title')}
      </Heading>

      <Flex alignItems="center" gap="1.6rem" marginBlock="2rem">
        <Input
          defaultValue={currencyValueIn}
          currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(code) => setCurrencyFlagIn(code)}
          onChange={(event) => setCurrencyValueIn(event.currentTarget.value)}
        />

        <Image
          src={arrowExchange}
          alt={translate('altExchange')}
          width="2.4rem"
          height="2.4rem"
        />

        <Input
          currencyCode={currencyFlagOut.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(codeIn) => setCurrencyFlagOut(codeIn)}
          defaultValue={currencyValueOut}
        />
      </Flex>

      <Heading w="100%" maxW="64rem" color="textPrimary" data-testid="subtitle">
        {translate('subtitle')}
      </Heading>

      <Box w="50%">
        <Chart data={[]} />
      </Box>

      <Footer />
    </Box>
  );
}
