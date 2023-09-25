import { Link, Avatar as ChakraAvatar } from '@chakra-ui/react';

export type AvatarProps = {
  githubUsername: string;
  fullName: string;
};

const Avatar = ({ fullName, githubUsername }: AvatarProps) => {
  const photoUrl = `https://github.com/${githubUsername}.png`;
  const githubLink = `https://github.com/${githubUsername}`;

  return (
    <Link href={githubLink} isExternal>
      <ChakraAvatar name={fullName} src={photoUrl} />
    </Link>
  );
};

export default Avatar;
