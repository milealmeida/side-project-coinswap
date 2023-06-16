import { Box, Button, Heading, useColorMode, useColorModeValue } from '@chakra-ui/react';

import { dark, light } from './styles/global';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const colors = useColorModeValue(light, dark);

  return (
    <Box
      bg={colors.bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      height="100vh"
    >
      <Heading color="primary">Hello World</Heading>
      <Button onClick={toggleColorMode}>
        {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </Box>
  );
}

export default App;
