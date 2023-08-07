import { ChangeEvent, useState } from 'react';
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
  MenuList
} from '@chakra-ui/react';

import { AcceptedCurrencies } from 'types/acceptedCurrencies';
import { content } from 'utils/content';

const InputComponent = () => {
  const [outline, setOutline] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currency, setCurrency] = useState('usd');

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
      jpy: country[4]
    };

    return countries[currencyKey];
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
  };

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
        p={{ base: '2.2rem', md: '2.6rem 1.6rem' }}
        maxW="16.2rem"
        w="100%"
        fontSize="1.6rem"
        border="none"
        variant="outline"
        _focus={{
          boxShadow: 'none'
        }}
        onChange={onChange}
        onFocus={() => setOutline(true)}
        onBlur={() => setOutline(false)}
        value={inputValue}
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
            {renderCountryCurrency(currency as AcceptedCurrencies)}
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
              onClick={() => setCurrency(code)}
              p="1.2rem 1.6rem"
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
