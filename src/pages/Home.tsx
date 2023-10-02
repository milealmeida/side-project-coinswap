import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Icon,
  Button,
  Text
} from '@chakra-ui/react';

import { Chart, Footer, Header, Input } from 'components';
import { useCurrency } from 'contexts/currency';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';

import { dark, light } from 'styles/global';
import { maskCurrency } from 'hooks/Masks';

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

  const [isSameFlag, setIsSameFlag] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value;
    let tempValue = value;

    if (value.length === 2 && value[0] === '0') {
      tempValue = tempValue.substring(1);
    }

    let formattedValueIn = tempValue?.replace(/[^0-9,]/g, '');
    if ((formattedValueIn.match(/,/g) || []).length > 1) {
      const parts = formattedValueIn.split(',');
      formattedValueIn = parts[0] + ',' + parts.slice(1).join('');
    }

    setCurrencyValueIn(formattedValueIn);
  };

  const formattedValue = (value: string) => {
    const valueFormatted = value.replace(/[^0-9,\.]/g, '').replace(',', '.');

    const formattedValue = maskCurrency(
      currencyFlagIn,
      Number(valueFormatted.replace(',', '.'))
    );

    setCurrencyValueIn(formattedValue);
  };

  const handleOnFocus = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedValueIn = event.target.value?.replace(/[^0-9,]/g, '');
    setCurrencyValueIn(formattedValueIn);
  };

  const handleOnBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value;
    if (value.trim() === '') return setCurrencyValueIn('R$ 0,00');

    formattedValue(value);
  };

  const handleButtonExchangeClick = () => {
    const tempCurrencyValueIn = currencyValueIn
      .replace(/[^0-9,\.]/g, '')
      .replace(',', '.');

    const tempCurrencyFlagIn = currencyFlagIn;

    setCurrencyValueIn(currencyValueOut);
    setCurrencyFlagIn(currencyFlagOut);
    setCurrencyValueOut(tempCurrencyValueIn);
    setCurrencyFlagOut(tempCurrencyFlagIn);
  };

  useEffect(() => {
    if (currencyFlagIn.toLowerCase() === currencyFlagOut.toLowerCase()) {
      return setIsSameFlag(true);
    }

    setIsSameFlag(false);
    formattedValue(currencyValueIn);
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
        <Input
          className="inputCurrencyFlagIn"
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          value={currencyValueIn}
          onClick={(event) => event.currentTarget.select()}
          currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
          onChangeCurrency={(codeIn) => {
            setCurrencyFlagIn(codeIn);
          }}
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
          disabled
          currencyCode={currencyFlagOut.toLowerCase() as AcceptedCurrencies}
          value={maskCurrency(currencyFlagOut, Number(currencyValueOut))}
          onChangeCurrency={(codeOut) => {
            setCurrencyFlagOut(codeOut);
          }}
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
