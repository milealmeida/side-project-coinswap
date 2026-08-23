import { ChangeEvent, FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import { Box, Flex, Heading, Icon, Button, Text } from '@chakra-ui/react';

import { Chart, CurrencyBoard, Footer, Header, Input } from 'components';
import { useColorModeValue } from 'components/ui/color-mode';
import { useCurrency } from 'contexts/currency';
import { CURRENCIES } from 'utils/currencies';

import { dark, light } from 'styles/global';
import { maskCurrency, parseAmount } from 'hooks/Masks';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const { t: translate } = useTranslation();

  const {
    currencyValueIn,
    currencyValueOut,
    currencyFlagIn,
    currencyFlagOut,
    isLoading,
    hasError,
    quoteRates,
    setCurrencyFlagIn,
    setCurrencyFlagOut,
    setCurrencyValueIn,
    setCurrencyValueOut
  } = useCurrency();

  const [isFocused, setIsFocused] = useState(false);

  const isSameFlag = currencyFlagIn === currencyFlagOut;

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

  const currencyValueInFormatted = Number.isFinite(amountIn)
    ? maskCurrency(currencyFlagIn, amountIn)
    : '';

  const currencyValueOutFormatted = Number.isFinite(amountOut)
    ? maskCurrency(currencyFlagOut, amountOut)
    : '';

  const fromCode = CURRENCIES[currencyFlagIn].text;
  const toCode = CURRENCIES[currencyFlagOut].text;

  const data = [
    {
      name: translate('chart.currency'),
      [fromCode]: Number.isFinite(amountIn) ? amountIn : 0,
      [toCode]: Number.isFinite(amountOut) ? amountOut : 0
    }
  ];

  const statusMessage = isSameFlag
    ? translate('errorMessage')
    : hasError
      ? translate('requestError')
      : isLoading
        ? translate('loading')
        : '';

  return (
    <Box
      bg={colors.bgColor}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDir="column"
      height="100vh"
    >
      <a href="#converter" data-sr-only>
        {translate('skipToConverter')}
      </a>
      <Header />
      <Box as="main" display="contents">
        <Heading
          as="h1"
          id="converter"
          tabIndex={-1}
          outline="none"
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
              currencyCode={currencyFlagIn}
              onChangeCurrency={setCurrencyFlagIn}
              onBlur={handleOnBlur}
              aria-label={translate('amountFrom', { currency: fromCode })}
              currencyAriaLabel={translate('selectCurrency', {
                currency: fromCode
              })}
              aria-invalid={isSameFlag}
              aria-describedby="converter-status"
            />

            <Button
              bg="transparent"
              aria-label={translate('swapCurrencies')}
              onClick={handleButtonExchangeClick}
            >
              <Icon
                width="2.4rem"
                height="2.4rem"
                color="iconExchange"
                aria-hidden="true"
              >
                <TbArrowsExchange />
              </Icon>
            </Button>

            <Input
              readOnly
              currencyCode={currencyFlagOut}
              value={currencyValueOutFormatted}
              onChangeCurrency={setCurrencyFlagOut}
              aria-label={translate('amountTo', { currency: toCode })}
              currencyAriaLabel={translate('selectCurrency', {
                currency: toCode
              })}
              aria-invalid={isSameFlag}
              aria-describedby="converter-status"
            />
          </Flex>

          <Text
            id="converter-status"
            role={isSameFlag || hasError ? 'alert' : 'status'}
            aria-live="polite"
            fontSize="lg"
            color={isSameFlag || hasError ? 'red' : 'textSecondary'}
            data-sr-only={statusMessage ? undefined : true}
            data-testid={
              hasError && !isSameFlag
                ? 'request-error'
                : isLoading && !isSameFlag
                  ? 'loading'
                  : undefined
            }
          >
            {statusMessage}
          </Text>
        </Flex>

        <Heading
          as="h2"
          w="100%"
          maxW="61rem"
          color="textPrimary"
          data-testid="subtitle"
          textAlign={{ base: 'center', md: 'left' }}
        >
          {translate('subtitle')}
        </Heading>

        <Chart
          data={data}
          summary={translate('chart.summary', {
            fromAmount: currencyValueInFormatted || '—',
            from: fromCode,
            toAmount: currencyValueOutFormatted || '—',
            to: toCode
          })}
        />

        <CurrencyBoard
          amountValue={currencyValueIn}
          fromFlag={currencyFlagIn}
          quoteRates={quoteRates}
        />
      </Box>
      <Footer />
    </Box>
  );
}
