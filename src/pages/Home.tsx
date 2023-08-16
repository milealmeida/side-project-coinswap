import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Icon,
  Button
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import { Chart, Footer, Header, Input } from 'components';
import { dark, light } from 'styles/global';
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
      <Heading
        color="primary"
        data-testid="title"
        paddingInline={{ base: '2rem', md: 0 }}
      >
        {translate('title')}
      </Heading>

      <Flex
        alignItems="center"
        gap={{ base: '1rem', md: '1.6rem' }}
        marginBlock="2rem"
        flexDir={{ base: 'column', md: 'row' }}
        paddingInline={{ base: '2rem', md: 0 }}
      >
        <Input
          defaultValue={currencyValueIn}
          currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(code) => setCurrencyFlagIn(code)}
          onChange={(event) => setCurrencyValueIn(event.currentTarget.value)}
        />

        <Button bg="transparent">
          <Icon
            as={TbArrowsExchange}
            width="2.4rem"
            height="2.4rem"
            color="iconExchange"
          />
        </Button>

        <Input
          currencyCode={currencyFlagOut.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(codeIn) => setCurrencyFlagOut(codeIn)}
          defaultValue={currencyValueOut}
          disabled
        />
      </Flex>

      <Heading
        w="100%"
        maxW="61rem"
        color="textPrimary"
        data-testid="subtitle"
        textAlign={{ base: 'center', md: 'left' }}
      >
        {translate('subtitle')}
      </Heading>

      <Box w={{ base: '90%', md: '50%' }}>
        <Chart data={[]} />
      </Box>

      <Footer />
    </Box>
  );
}
