import { ChangeEvent, useRef, useEffect, useState } from 'react';
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
    currencyValueInFormatted,
    currencyValueOut,
    currencyFlagIn,
    currencyFlagOut,
    setCurrencyFlagIn,
    setCurrencyFlagOut,
    setCurrencyValueIn,
    setCurrencyValueOut
  } = useCurrency();

  const [isSameFlag, setIsSameFlag] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputCurrencyValueInRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value;
    let tempValue = value;

    if (value.length === 2 && value[0] === '0') {
      tempValue = tempValue.substring(1);
    }

    setCurrencyValueIn(tempValue);
  };

  const handleOnFocus = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedValueIn = event.target.value;
    setCurrencyValueIn(formattedValueIn);
  };

  const handleOnBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value;
    if (value.trim() === '') return setCurrencyValueIn('R$ 0,00');
  };

  const handleButtonExchangeClick = () => {
    const tempCurrencyValueIn = currencyValueIn;

    const tempCurrencyFlagIn = currencyFlagIn;

    setCurrencyValueIn(currencyValueOut);
    setCurrencyFlagIn(currencyFlagOut);
    setCurrencyValueOut(tempCurrencyValueIn);
    setCurrencyFlagOut(tempCurrencyFlagIn);
  };

  const handleIsFocused = () => {
    setIsFocused(true);
    inputCurrencyValueInRef.current?.focus();
  };

  useEffect(() => {
    if (currencyFlagIn.toLowerCase() === currencyFlagOut.toLowerCase()) {
      return setIsSameFlag(true);
    }

    setIsSameFlag(false);
  }, [currencyFlagIn, currencyFlagOut]);

  const data = [
    {
      name: 'Moeda',
      [currencyFlagIn]: currencyValueIn,
      [currencyFlagOut]: currencyValueOut
    }
  ];

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
        <div style={{ position: 'relative' }}>
          <Input
            reference={inputCurrencyValueInRef}
            className="inputCurrencyFlagIn"
            onChange={handleInputChange}
            onBlur={(e) => {
              handleOnBlur(e);
              setIsFocused(false);
            }}
            onFocus={handleOnFocus}
            value={currencyValueIn}
            onClick={(event) => event.currentTarget.select()}
            currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
            onChangeCurrency={(codeIn) => {
              setCurrencyFlagIn(codeIn);
            }}
          />

          {!isFocused && (
            <Flex
              onClick={handleIsFocused}
              bg={colors.bgColor}
              width="45%"
              height="3rem"
              position="absolute"
              top={{ base: '1.2rem', md: '1.5rem' }}
              left={{ base: '1.8rem', md: '1.8rem' }}
              fontSize="1.6rem"
            >
              {currencyValueInFormatted}
            </Flex>
          )}
        </div>

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

      <Chart data={data} />

      <Footer />
    </Box>
  );
}
