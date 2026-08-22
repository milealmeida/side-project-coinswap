import { ChangeEvent, FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import { Box, Flex, Heading, Icon, Button, Text } from '@chakra-ui/react';

import { Chart, Footer, Header, Input } from 'components';
import { useColorModeValue } from 'components/ui/color-mode';
import { useCurrency } from 'contexts/currency';
import { AcceptedCurrencies } from 'types/acceptedCurrencies';

import { dark, light } from 'styles/global';
import { maskCurrency, parseAmount } from 'hooks/Masks';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const { t: translate } = useTranslation();

  const {
    currencyValueIn,
    currencyValueInFormatted,
    currencyValueOut,
    currencyFlagIn,
    currencyFlagOut,
    isLoading,
    hasError,
    setCurrencyFlagIn,
    setCurrencyFlagOut,
    setCurrencyValueIn,
    setCurrencyValueOut
  } = useCurrency();

  const [isFocused, setIsFocused] = useState(false);

  const isSameFlag =
    currencyFlagIn.toLowerCase() === currencyFlagOut.toLowerCase();

  const amountIn = parseAmount(currencyFlagIn, currencyValueIn);
  const amountOut = parseAmount(currencyFlagOut, currencyValueOut);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value?.replace(/[^0-9,\.]/g, '');
    let tempValue = value;

    if (value.length === 2 && value[0] === '0')
      tempValue = tempValue.substring(1);

    setCurrencyValueIn(tempValue.substring(0, 11));
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget?.value;
    if (value.trim() === '') setCurrencyValueIn('1');
    setIsFocused(false);
  };

  const handleButtonExchangeClick = () => {
    const tempCurrencyValueIn = currencyValueIn;

    const tempCurrencyFlagIn = currencyFlagIn;

    setCurrencyValueIn(currencyValueOut);
    setCurrencyFlagIn(currencyFlagOut);
    setCurrencyValueOut(tempCurrencyValueIn);
    setCurrencyFlagOut(tempCurrencyFlagIn);
  };

  const data = [
    {
      name: translate('chart.currency'),
      [currencyFlagIn]: Number.isFinite(amountIn) ? amountIn : 0,
      [currencyFlagOut]: Number.isFinite(amountOut) ? amountOut : 0
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
        alignItems="center"
        gap={{ base: '1rem', md: '1.6rem' }}
        marginBlock="2rem"
        flexDir="column"
        paddingInline={{ base: '2rem', md: 0 }}
      >
        <Flex
          alignItems="center"
          gap={{ base: '1rem', md: '1.6rem' }}
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Input
            inputMode="decimal"
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            value={isFocused ? currencyValueIn : currencyValueInFormatted}
            onClick={(event) => event.currentTarget.select()}
            currencyCode={currencyFlagIn.toLowerCase() as AcceptedCurrencies}
            onChangeCurrency={(codeIn) => {
              setCurrencyFlagIn(codeIn);
            }}
            onBlur={handleOnBlur}
          />

          <Button
            bg="transparent"
            aria-label={translate('swapCurrencies')}
            onClick={handleButtonExchangeClick}
          >
            <Icon width="2.4rem" height="2.4rem" color="iconExchange">
              <TbArrowsExchange />
            </Icon>
          </Button>

          <Input
            disabled
            currencyCode={currencyFlagOut.toLowerCase() as AcceptedCurrencies}
            value={
              Number.isFinite(amountOut)
                ? maskCurrency(currencyFlagOut, amountOut)
                : ''
            }
            onChangeCurrency={(codeOut) => {
              setCurrencyFlagOut(codeOut);
            }}
          />
        </Flex>

        {isSameFlag && (
          <Text fontSize="lg" color="red">
            {translate('errorMessage')}
          </Text>
        )}

        {hasError && !isSameFlag && (
          <Text fontSize="lg" color="red" data-testid="request-error">
            {translate('requestError')}
          </Text>
        )}

        {isLoading && !isSameFlag && (
          <Text fontSize="lg" color="textSecondary" data-testid="loading">
            {translate('loading')}
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
