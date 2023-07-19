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

import usd from 'assets/img/usd.svg';
import eur from 'assets/img/eur.svg';
import gbp from 'assets/img/gbp.svg';
import chf from 'assets/img/chf.svg';
import jpy from 'assets/img/jpy.svg';
import { FaChevronDown } from 'react-icons/fa';
import { AcceptedCurrencies } from 'types/Languages';

const InputComponent = () => {
  const content = [
    {
      id: 1,
      src: usd,
      code: 'usd',
      alt: 'Bandeira dos Estados Unidos',
      text: 'USD'
    },
    {
      id: 2,
      src: eur,
      code: 'eur',
      alt: 'Bandeira da Europa',
      text: 'EUR'
    },
    {
      id: 3,
      src: gbp,
      code: 'gbp',
      alt: 'Bandeira da Inglaterra',
      text: 'GBP'
    },
    {
      id: 4,
      src: chf,
      code: 'chf',
      alt: 'Bandeira da Suiça',
      text: 'CHF'
    },
    {
      id: 5,
      src: jpy,
      code: 'jpy',
      alt: 'Bandeira do Japão',
      text: 'JPY'
    }
  ];

  const renderCountryIcon = (iconKey: AcceptedCurrencies) => {
    const data = {
      usd: (
        <Flex gap="0.8rem" alignItems="center">
          <Image boxSize="2.4rem" src={content[0].src} alt={content[0].alt} />
          <Heading
            color="textPrimary"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
          >
            {content[0].text}
          </Heading>
        </Flex>
      ),
      eur: (
        <Flex gap="0.8rem" alignItems="center">
          <Image boxSize="2.4rem" src={content[1].src} alt={content[1].alt} />
          <Heading
            color="textPrimary"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
          >
            {content[1].text}
          </Heading>
        </Flex>
      ),
      gbp: (
        <Flex gap="0.8rem" alignItems="center">
          <Image boxSize="2.4rem" src={content[2].src} alt={content[2].alt} />
          <Heading
            color="textPrimary"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
          >
            {content[2].text}
          </Heading>
        </Flex>
      ),
      chf: (
        <Flex gap="0.8rem" alignItems="center">
          <Image boxSize="2.4rem" src={content[3].src} alt={content[3].alt} />
          <Heading
            color="textPrimary"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
          >
            {content[3].text}
          </Heading>
        </Flex>
      ),
      jpy: (
        <Flex gap="0.8rem" alignItems="center">
          <Image boxSize="2.4rem" src={content[4].src} alt={content[4].alt} />
          <Heading
            color="textPrimary"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
          >
            {content[4].text}
          </Heading>
        </Flex>
      )
    };

    return data[iconKey];
  };

  return (
    <Flex>
      <Input />

      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FaChevronDown />}
          bg="#94A3B8"
          p="1.6rem"
          w="100%"
        >
          <Flex
            color="#0F172A"
            fontSize="1.6rem"
            fontWeight={400}
            lineHeight="1.6rem"
            gap="0.8rem"
            alignItems="center"
          >
            {renderCountryIcon('eur')}
          </Flex>
        </MenuButton>
        <MenuList maxW="16rem" height="11rem">
          {content.map(({ id, code }) => (
            <MenuItem key={id} p="1.2rem 1.6rem">
              {renderCountryIcon(code as AcceptedCurrencies)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default InputComponent;
