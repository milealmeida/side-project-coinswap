import { AvatarGroup, Center, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Avatar from './Avatar';

import { useColorModeValue } from 'components/ui/color-mode';
import { contributors } from 'mocks/contributors';
import { dark, light } from 'styles/global';

const Footer = () => {
  const colors = useColorModeValue(light, dark);
  const { t: translate } = useTranslation();

  return (
    <Center as="footer">
      <Flex
        p={{ base: '1.6rem 2rem 2.5rem', md: '2.5rem' }}
        fontSize="1.4rem"
        gap="0.8rem"
        color={colors.textSecondary}
        fontWeight="500"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Text>{translate('footer.created')}</Text>

        <AvatarGroup>
          <Flex gap={2}>
            {contributors.map(({ fullName, githubUsername }) => (
              <Avatar
                key={`${translate('footer.keyTitle')} ${fullName}`}
                fullName={fullName}
                githubUsername={githubUsername}
              />
            ))}
          </Flex>
        </AvatarGroup>

        <Text aria-hidden="true">·</Text>
        <Text>{translate('footer.version')}</Text>
      </Flex>
    </Center>
  );
};

export default Footer;
