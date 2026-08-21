import { Link, Avatar as ChakraAvatar } from '@chakra-ui/react';

export type AvatarProps = {
  githubUsername: string;
  fullName: string;
};

const Avatar = ({ fullName, githubUsername }: AvatarProps) => {
  const photoUrl = `https://github.com/${githubUsername}.png`;
  const githubLink = `https://github.com/${githubUsername}`;

  return (
    <Link href={githubLink} target="_blank" rel="noopener noreferrer">
      <ChakraAvatar.Root>
        <ChakraAvatar.Fallback name={fullName} />
        <ChakraAvatar.Image src={photoUrl} />
      </ChakraAvatar.Root>
    </Link>
  );
};

export default Avatar;
