import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { Footer, Header } from 'components';

import { dark, light } from 'styles/global';

export default function Home() {
  const colors = useColorModeValue(light, dark);

  return (
    <Box
      bg={colors.bgColor}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDir="column"
      height="100vh"
    >
      <Header />

      <Heading color="primary">Hello World</Heading>
      <Footer />
    </Box>
  );
}
