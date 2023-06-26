import { Box, Heading, useColorModeValue } from '@chakra-ui/react';

import { Chart, Footer, Header } from 'components';
import { useEffect, useState } from 'react';

import { dark, light } from 'styles/global';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const [data, setdata] = useState<[]>([]);

  useEffect(() => {
    const fetchDatas = async () => {
      const res = await fetch('https://api.coincap.io/v2/assets/?limit=20');
      const data = await res.json();
      setdata(data?.data);
    };

    fetchDatas();
  }, []);

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

      <Box w="50%">
        <Chart data={data} />
      </Box>

      <Footer />
    </Box>
  );
}
