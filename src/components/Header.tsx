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

import es from 'assets/img/es.svg';
import ptBr from 'assets/img/pt-br.svg';
import usa from 'assets/img/usa.svg';

import { type AcceptedLanguages } from 'types/Languages';
import { Languages } from 'constants/languages';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  const currentLanguage = i18n.language as AcceptedLanguages;

  const renderCountryIcon = (iconKey: AcceptedLanguages) => {
    const data = {
      ptBr: <Image w="3rem" src={ptBr} alt="Flag of Brazil" />,
      es: <Image w="3rem" src={es} alt="Flag of Spain" />,
      en: <Image w="3rem" src={usa} alt="Flag of USA" />
    };

    return data[iconKey];
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
          <MenuButton fontSize="1.6rem">
            {renderCountryIcon(currentLanguage)}
          </MenuButton>
          <MenuList minW="initial" width="6rem">
            {Languages.map(({ label, code }) => (
              <MenuItem
                key={label}
                justifyContent="center"
                onClick={() => i18n.changeLanguage(code)}
              >
                {renderCountryIcon(code as AcceptedLanguages)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
