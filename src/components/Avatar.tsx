import { Flex, Link, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { dark, light } from 'styles/global';

export type AvatarProps = {
  githubUsername: string;
  fullName: string;
};

const Avatar = ({ fullName, githubUsername }: AvatarProps) => {
  const colors = useColorModeValue(light, dark);

  const photoUrl = `https://github.com/${githubUsername}.png`;
  const githubLink = `https://github.com/${githubUsername}`;

  return (
    <Link href={githubLink} isExternal>
      <Flex gap="0.6rem">
        <Image
          src={photoUrl}
          alt={`Profile-photo-of-${fullName}`}
          w="2rem"
          h="2rem"
          borderRadius="50%"
        />

        <Text
          fontWeight="600"
          color={colors.textPrimary}
          display={{ base: 'none', md: 'block' }}
        >
          {fullName}
        </Text>
      </Flex>
    </Link>
  );
};

export default Avatar;
