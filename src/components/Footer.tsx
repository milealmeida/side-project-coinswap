import {
  AvatarGroup,
  Center,
  Flex,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import Avatar from './Avatar';

import { contributors } from 'mocks/contributors';
import { dark, light } from 'styles/global';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const colors = useColorModeValue(light, dark);
  const { t: translate } = useTranslation();

  return (
    <Center>
      <Flex
        p="2.5rem"
        fontSize="1.4rem"
        gap="0.8rem"
        color={colors.textSecondary}
        fontWeight="500"
      >
        <Text pt={2} display={{ base: 'none', md: 'flex' }}>
          {translate('footer.created')}
        </Text>
        <AvatarGroup>
          {contributors.map(({ fullName, githubUsername }) => (
            <Avatar
              key={`${translate('footer.keyTitle')} ${fullName}`}
              fullName={fullName}
              githubUsername={githubUsername}
            />
          ))}
        </AvatarGroup>
      </Flex>
    </Center>
  );
};

export default Footer;
