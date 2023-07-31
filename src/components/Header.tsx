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
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { AcceptedLanguages } from 'types/acceptedLanguages';
import { languages } from 'assets/locales/languages';
import { es, ptBr, usa } from 'assets/img';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t: translate } = useTranslation();

  const currentLanguage = i18n.language as AcceptedLanguages;

  const renderCountryIcon = (iconKey: AcceptedLanguages) => {
    const data = {
      ptBr: <Image w="3rem" src={ptBr} alt={translate('flags.brazil')} />,
      es: <Image w="3rem" src={es} alt={translate('flags.spain')} />,
      en: <Image w="3rem" src={usa} alt={translate('flags.usa')} />
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
            {languages.map(({ label, code }) => (
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
