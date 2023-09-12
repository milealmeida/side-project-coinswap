import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Icon,
  Button,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import { Chart, Footer, Header, Input } from 'components';
import { useCurrency } from 'contexts/currency';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { getCurrencyFormatted } from 'utils/getCurrencyFormatted';

import { dark, light } from 'styles/global';

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
    setCurrencyValueIn,
    setCurrencyValueOut
  } = useCurrency();

  const [isFocused, setIsFocused] = useState(false);
  const [isSameFlag, setIsSameFlag] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isFocused && event.target.value.trim() === '') {
      return setCurrencyValueIn('0');
    }

    return setCurrencyValueIn(event.currentTarget.value);
  };

  const handleButtonExchangeClick = () => {
    const tempCurrencyValueIn = currencyValueIn;
    const tempCurrencyFlagIn = currencyFlagIn;

    setCurrencyValueIn(currencyValueOut);
    setCurrencyFlagIn(currencyFlagOut);
    setCurrencyValueOut(tempCurrencyValueIn);
    setCurrencyFlagOut(tempCurrencyFlagIn);
  };

  const handleCurrencyFormatted = (
    currencyFlag: string,
    currencyValue: number
  ) => {
    const { country, currency } = getCurrencyFormatted(
      currencyFlag as AcceptedCurrencies
    );

    const currencyFormatted = new Intl.NumberFormat(country, {
      style: 'currency',
      currency
    }).format(currencyValue);

    return currencyFormatted;
  };

  useEffect(() => {
    if (currencyFlagIn.toLowerCase() === currencyFlagOut) {
      setIsSameFlag(true);

      return;
    }

    setIsSameFlag(false);
  }, [currencyFlagIn, currencyFlagOut]);

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
        position="relative"
        alignItems="center"
        gap={{ base: '1rem', md: '1.6rem' }}
        marginBlock="2rem"
        flexDir={{ base: 'column', md: 'row' }}
        paddingInline={{ base: '2rem', md: 0 }}
      >
        {/* handleCurrencyFormatted(
            currencyFlagIn,
            Number(currencyValueIn)
          ) */}

        <Input
          value={currencyValueIn}
          currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(codeIn) => setCurrencyFlagIn(codeIn)}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <Button bg="transparent" onClick={handleButtonExchangeClick}>
          <Icon
            as={TbArrowsExchange}
            width="2.4rem"
            height="2.4rem"
            color="iconExchange"
          />
        </Button>

        <Input
          value={handleCurrencyFormatted(
            currencyFlagOut,
            Number(currencyValueOut)
          )}
          currencyCode={currencyFlagOut.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(codeOut) => setCurrencyFlagOut(codeOut)}
          disabled
        />

        {isSameFlag && (
          <Text
            position="absolute"
            top="6rem"
            right="0"
            fontSize="lg"
            color="red"
          >
            {translate('errorMessage')}
          </Text>
        )}
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
