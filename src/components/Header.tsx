import { useState } from 'react';

import {
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

import es from '../assets/img/es.svg';
import ptBr from '../assets/img/pt-br.svg';
import usa from '../assets/img/usa.svg';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [language, setLanguage] = useState('usa');

  const handleLanguageFlag = () => {
    if (language === 'ptBr') {
      return <Image w="3rem" src={ptBr} alt="Flag of Brazil" />;
    }

    if (language === 'es') {
      return <Image w="3rem" src={es} alt="Flag of Spain" />;
    }

    return <Image w="3rem" src={usa} alt="Flag of USA" />;
  };

  const handleLanguageOption = (languageSelected: string) => {
    setLanguage(languageSelected);
  };

  return (
    <Flex
      maxW="120rem"
      w="100%"
      marginInline="auto"
      alignItems="center"
      justifyContent="space-between"
      p="4rem"
    >
      <Link href="/">
        <Heading>CoinStrap</Heading>
      </Link>

      <Flex gap="2rem">
        <IconButton
          fontSize="1.6rem"
          width="3rem"
          height="3rem"
          bg="transparent"
          aria-label="toggle theme"
          rounded="full"
          onClick={toggleColorMode}
          icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
        />

        <Menu isLazy>
          <MenuButton fontSize="1.6rem">{handleLanguageFlag()}</MenuButton>
          <MenuList minW="initial" width="6rem">
            <MenuItem
              justifyContent="center"
              onClick={() => handleLanguageOption('usa')}
              bg={language === 'usa' ? 'rgba(2, 167, 36, 0.6)' : 'transparent'}
            >
              <Image w="3rem" src={usa} alt="Flag of USA" />
            </MenuItem>
            <MenuItem
              justifyContent="center"
              onClick={() => handleLanguageOption('es')}
              bg={language === 'es' ? 'rgba(2, 167, 36, 0.6)' : 'transparent'}
            >
              <Image w="3rem" src={es} alt="Flag of Spain" />
            </MenuItem>
            <MenuItem
              justifyContent="center"
              onClick={() => handleLanguageOption('ptBr')}
              bg={language === 'ptBr' ? 'rgba(2, 167, 36, 0.6)' : 'transparent'}
            >
              <Image w="3rem" src={ptBr} alt="Flag of Brazil" />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
