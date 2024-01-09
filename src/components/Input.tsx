import { InputHTMLAttributes, LegacyRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode
} from '@chakra-ui/react';

import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { content } from 'utils/content';

export type InputComponentProps = {
  currencyCode: AcceptedCurrencies;
  reference?: LegacyRef<HTMLInputElement>;
  onChangeCurrency: (code: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const InputComponent = ({
  currencyCode,
  reference,
  onChangeCurrency,
  ...rest
}: InputComponentProps) => {
  const { colorMode } = useColorMode();
  const [outline, setOutline] = useState(false);

  const renderCountryCurrency = (currencyKey: AcceptedCurrencies) => {
    const country = content.map((item) => (
      <Flex gap="0.8rem" alignItems="center" key={item.id}>
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
    ));

    const countries = {
      usd: country[0],
      eur: country[1],
      gbp: country[2],
      chf: country[3],
      brl: country[4]
    };

    return countries[currencyKey] ?? countries.usd;
  };

  const { onFocus, onBlur } = rest;

  return (
    <Flex
      borderRadius="0.8rem"
      border={`1.5px solid ${outline ? '#7C3AED' : '#94A3B8'}`}
      overflow="hidden"
      alignItems="center"
      css={{
        '&:hover': {
          borderColor: '#7C3AED'
        }
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
          color: colorMode === 'light' ? '#0F172A' : '#fff'
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

      <Flex bgColor="middleGray" width="0.1rem" height="2.4rem" />

      <Menu>
        <MenuButton
          p={{ base: '2.2rem 1.2rem', md: '2.6rem 1.6rem' }}
          maxW="13rem"
          w="100%"
          as={Button}
          rightIcon={<FaChevronDown />}
          bg="transparent"
          css={{
            borderRadius: '0',
            '&:hover, &:focus': {
              backgroundColor: '#828fa0'
            },
            '&:active, &[data-active]': {
              backgroundColor: '#94A3B8'
            }
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
        </MenuButton>

        <MenuList
          maxW="16rem"
          maxH="17.5rem"
          overflow="scroll"
          borderRadius="0.8rem"
          boxShadow="0 0.4rem 1.6rem 0 rgba(15, 23, 42, 0.15)"
          onFocus={() => setOutline(true)}
          onBlur={() => setOutline(false)}
        >
          {content.map(({ id, code }) => (
            <MenuItem
              key={id}
              p="1.2rem 1.6rem"
              onClick={() => onChangeCurrency(code.toUpperCase())}
              css={{
                '&:hover, &:focus': {
                  backgroundColor: '#94A3B8'
                }
              }}
            >
              {renderCountryCurrency(code as AcceptedCurrencies)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default InputComponent;
