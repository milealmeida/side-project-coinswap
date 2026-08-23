import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowsExchange } from 'react-icons/tb';

import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';

import { Chart, CurrencyBoard, Footer, Header, Input } from 'components';
import { useColorModeValue } from 'components/ui/color-mode';
import { useCurrency } from 'contexts/currency';
import { maskCurrency, parseAmount } from 'hooks/Masks';
import { useQuoteHistory, type HistoryRange } from 'hooks/useQuoteHistory';
import { copyText } from 'utils/clipboard';
import { CURRENCIES } from 'utils/currencies';
import { toHtmlLang } from 'utils/userUtils';

import { dark, light } from 'styles/global';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const { t: translate, i18n } = useTranslation();

  const {
    currencyValueIn,
    currencyValueOut,
    currencyFlagIn,
    currencyFlagOut,
    isLoading,
    hasError,
    isStale,
    quoteRates,
    setCurrencyFlagIn,
    setCurrencyFlagOut,
    setCurrencyValueIn,
    setCurrencyValueOut
  } = useCurrency();

  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyDays, setHistoryDays] = useState<HistoryRange>(7);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

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

  useEffect(() => {
    return () => window.clearTimeout(copiedTimer.current);
  }, []);

  const currencyValueInFormatted = Number.isFinite(amountIn)
    ? maskCurrency(currencyFlagIn, amountIn)
    : '';

  const currencyValueOutFormatted = Number.isFinite(amountOut)
    ? maskCurrency(currencyFlagOut, amountOut)
    : '';

  const fromCode = CURRENCIES[currencyFlagIn].text;
  const toCode = CURRENCIES[currencyFlagOut].text;

  const {
    points: historyPoints,
    isLoading: historyLoading,
    hasError: historyError
  } = useQuoteHistory(
    currencyFlagIn,
    currencyFlagOut,
    historyDays,
    toHtmlLang(i18n.language)
  );

  const showStaleBadge = isStale && !isSameFlag && !hasError;

  const statusMessage = isSameFlag
    ? translate('errorMessage')
    : hasError
      ? translate('requestError')
      : showStaleBadge
        ? translate('staleQuote')
        : isLoading
          ? translate('loading')
          : '';

  const resultSummary = translate('chart.summary', {
    fromAmount: currencyValueInFormatted || '—',
    from: fromCode,
    toAmount: currencyValueOutFormatted || '—',
    to: toCode
  });

  const handleCopyResult = async () => {
    if (!currencyValueOutFormatted) return;

    try {
      await copyText(resultSummary);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      bg={colors.bgColor}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDir="column"
      minH="100vh"
      css={{ minHeight: '100dvh' }}
      overflowX="hidden"
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
          gap="2rem"
          marginBlock="2rem"
          flexDir="column"
          w="100%"
          maxW="60rem"
          paddingInline={{ base: '2rem', md: 0 }}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            gap={{ base: '1rem', md: '1.6rem' }}
            flexDir={{ base: 'column', md: 'row' }}
            w="100%"
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

          <Button
            bg="primary"
            color="bgColor"
            fontSize="1.4rem"
            fontWeight="500"
            p="2rem"
            borderRadius="0.8rem"
            onClick={handleCopyResult}
            disabled={!currencyValueOutFormatted || hasError}
            aria-label={translate('copyResult')}
            _hover={{
              filter: 'brightness(1.1)'
            }}
            _disabled={{
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          >
            {copied ? translate('copied') : translate('copyResult')}
          </Button>

          <Text
            id="converter-status"
            role={isSameFlag || hasError ? 'alert' : 'status'}
            aria-live="polite"
            fontSize={showStaleBadge ? '1.2rem' : 'lg'}
            fontWeight={showStaleBadge ? '500' : undefined}
            color={isSameFlag || hasError ? 'red' : 'textSecondary'}
            borderWidth={showStaleBadge ? '1px' : undefined}
            borderColor={showStaleBadge ? 'accent' : undefined}
            borderRadius={showStaleBadge ? '999px' : undefined}
            px={showStaleBadge ? '1.2rem' : undefined}
            py={showStaleBadge ? '0.4rem' : undefined}
            data-sr-only={statusMessage ? undefined : true}
            data-testid={
              hasError && !isSameFlag
                ? 'request-error'
                : showStaleBadge
                  ? 'stale-quote'
                  : isLoading && !isSameFlag
                    ? 'loading'
                    : undefined
            }
          >
            {statusMessage}
          </Text>
        </Flex>

        <Flex
          w="100%"
          maxW="61rem"
          alignItems={{ base: 'center', md: 'center' }}
          justifyContent={{ base: 'center', md: 'space-between' }}
          flexDir={{ base: 'column', md: 'row' }}
          gap="1.2rem"
          paddingInline={{ base: '2rem', md: 0 }}
        >
          <Heading
            as="h2"
            color="textPrimary"
            data-testid="subtitle"
            textAlign={{ base: 'center', md: 'left' }}
          >
            {translate('subtitle')}
          </Heading>
          <Flex gap="0.8rem">
            {([7, 30] as const).map((days) => (
              <Button
                key={days}
                bg={historyDays === days ? 'primary' : 'transparent'}
                color={historyDays === days ? 'bgColor' : 'textPrimary'}
                fontSize="1.4rem"
                fontWeight="500"
                p="0.8rem 1.2rem"
                borderRadius="0.8rem"
                onClick={() => setHistoryDays(days)}
                aria-pressed={historyDays === days}
              >
                {translate(days === 7 ? 'chart.days7' : 'chart.days30')}
              </Button>
            ))}
          </Flex>
        </Flex>

        <Chart
          data={historyPoints}
          summary={translate('chart.history', {
            from: fromCode,
            to: toCode,
            days: historyDays
          })}
          dateLabel={translate('chart.date')}
          rateLabel={translate('chart.rate')}
          message={
            isSameFlag
              ? translate('chart.samePair')
              : historyLoading && historyPoints.length === 0
                ? translate('chart.loading')
                : historyError
                  ? translate('chart.empty')
                  : historyPoints.length === 0
                    ? translate('chart.empty')
                    : undefined
          }
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
