import { Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { dark, light } from '../styles/global';
import { Avatar } from '../components';

const Footer = () => {
  const colors = useColorModeValue(light, dark);

  return (
    <Center position="absolute" left="0" right="0" bottom="0">
      <Flex
        p="2.5rem"
        fontSize="1.4rem"
        gap="0.8rem"
        color={colors.textSecondary}
        fontWeight="500"
      >
        <Text>Created by</Text>
        <Avatar githubUsername="milealmeida" fullName="Milena" />
        <Text>and</Text>
        <Avatar githubUsername="iamdevmarcos" fullName="Mendes" />
      </Flex>
    </Center>
  );
};

export default Footer;
