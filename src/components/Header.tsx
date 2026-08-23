import {
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Menu,
  Portal
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { useColorMode } from 'components/ui/color-mode';
import { AcceptedLanguages } from 'types/acceptedLanguages';
import { languages } from 'assets/locales/languages';
import { es, ptBr, usa } from 'assets/img';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t: translate } = useTranslation();

  const currentLanguage = i18n.language as AcceptedLanguages;
  const flagAlt = {
    ptBr: 'flags.brazil',
    es: 'flags.spain',
    en: 'flags.usa'
  } as const;

  const renderCountryIcon = (iconKey: AcceptedLanguages, alt: string) => {
    const data = {
      ptBr: ptBr,
      es: es,
      en: usa
    };

    return <Image w="3rem" src={data[iconKey] ?? usa} alt={alt} />;
  };

  return (
    <Flex
      as="header"
      maxW="120rem"
      w="100%"
      marginInline="auto"
      alignItems="center"
      justifyContent="space-between"
      p={{ base: '2rem', md: '4rem' }}
    >
      <Link href="/" aria-label="CoinSwap">
        <Heading as="p">CoinSwap</Heading>
      </Link>

      <Flex gap="2rem">
        <IconButton
          fontSize="1.6rem"
          width="3rem"
          height="3rem"
          bg="transparent"
          aria-label={
            colorMode === 'dark'
              ? translate('theme.light')
              : translate('theme.dark')
          }
          rounded="full"
          onClick={toggleColorMode}
        >
          {colorMode === 'dark' ? (
            <FaSun aria-hidden="true" />
          ) : (
            <FaMoon aria-hidden="true" />
          )}
        </IconButton>

        <Menu.Root lazyMount>
          <Menu.Trigger
            fontSize="1.6rem"
            aria-label={translate('languageMenu')}
          >
            {renderCountryIcon(
              currentLanguage,
              translate(flagAlt[currentLanguage] ?? flagAlt.en)
            )}
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="initial" width="6rem">
                {languages.map(({ label, code }) => (
                  <Menu.Item
                    key={label}
                    value={code}
                    justifyContent="center"
                    aria-label={label}
                    onClick={() => i18n.changeLanguage(code)}
                  >
                    {renderCountryIcon(code as AcceptedLanguages, '')}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
};

export default Header;
