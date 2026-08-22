import { InputHTMLAttributes, LegacyRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Menu,
  Portal
} from '@chakra-ui/react';

import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { CURRENCIES, currencyList } from 'utils/currencies';

export type InputComponentProps = {
  currencyCode: AcceptedCurrencies;
  reference?: LegacyRef<HTMLInputElement>;
  onChangeCurrency: (code: AcceptedCurrencies) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>;

const InputComponent = ({
  currencyCode,
  reference,
  onChangeCurrency,
  ...rest
}: InputComponentProps) => {
  const [outline, setOutline] = useState(false);

  const renderCountryCurrency = (currencyKey: AcceptedCurrencies) => {
    const item = CURRENCIES[currencyKey] ?? CURRENCIES.usd;

    return (
      <Flex gap="0.8rem" alignItems="center">
        <Image boxSize="2.4rem" src={item.src} alt={item.alt} />
        <Heading
          color="textPrimary"
          fontSize="1.6rem"
          fontWeight={400}
          lineHeight="1.6rem"
        >
          {item.text}
        </Heading>
      </Flex>
    );
  };

  const { onFocus, onBlur } = rest;

  return (
    <Flex
      borderRadius="0.8rem"
      borderWidth="1.5px"
      borderStyle="solid"
      borderColor={outline ? 'accent' : 'middleGray'}
      overflow="hidden"
      alignItems="center"
      _hover={{
        borderColor: 'accent'
      }}
    >
      <Input
        ref={reference}
        p={{ base: '2.2rem', md: '2.6rem 1.6rem' }}
        maxW="16.2rem"
        w="100%"
        fontSize="1.6rem"
        border="none"
        variant="outline"
        _focus={{
          boxShadow: 'none'
        }}
        {...rest}
        type="text"
        size="lg"
        _disabled={{
          color: 'textPrimary'
        }}
        onBlur={(event) => {
          setOutline(false);
          onBlur && onBlur(event);
        }}
        onFocus={(event) => {
          setOutline(true);
          onFocus && onFocus(event);
        }}
      />

      <Flex bg="middleGray" width="0.1rem" height="2.4rem" />

      <Menu.Root>
        <Menu.Trigger asChild>
          <Button
            p={{ base: '2.2rem 1.2rem', md: '2.6rem 1.6rem' }}
            maxW="13rem"
            w="100%"
            bg="transparent"
            _hover={{ bg: 'surfaceSecondary' }}
            _focus={{ bg: 'surfaceSecondary' }}
            _active={{ bg: 'middleGray' }}
            css={{
              borderRadius: '0'
            }}
          >
            <Flex
              color="textPrimary"
              fontSize="1.6rem"
              fontWeight={400}
              lineHeight="1.6rem"
              gap="0.8rem"
              alignItems="center"
            >
              {renderCountryCurrency(currencyCode)}
            </Flex>
            <FaChevronDown />
          </Button>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content
              maxW="16rem"
              maxH="17.5rem"
              overflow="scroll"
              borderRadius="0.8rem"
              onFocus={() => setOutline(true)}
              onBlur={() => setOutline(false)}
            >
              {currencyList.map(({ code }) => (
                <Menu.Item
                  key={code}
                  value={code}
                  p="1.2rem 1.6rem"
                  onClick={() => onChangeCurrency(code)}
                  _hover={{ bg: 'middleGray' }}
                  _focus={{ bg: 'middleGray' }}
                >
                  {renderCountryCurrency(code)}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
};

export default InputComponent;
