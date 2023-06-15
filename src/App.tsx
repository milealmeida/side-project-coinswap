import { ChakraProvider, Heading } from '@chakra-ui/react';

import { theme } from './styles/global';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Heading color="textPrimary">Hello World</Heading>
    </ChakraProvider>
  );
}

export default App;
