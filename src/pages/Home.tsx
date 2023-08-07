import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Image, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Chart, Footer, Header, Input } from 'components';
import { dark, light } from 'styles/global';
import { arrowExchange } from 'assets/img';

export default function Home() {
  const colors = useColorModeValue(light, dark);
  const [data, setdata] = useState<[]>([]);

  const { t: translate } = useTranslation();

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
      <Heading
        color="primary"
        data-testid="title"
        paddingInline={{ base: '2rem', md: 0 }}
      >
        {translate('title')}
      </Heading>

      <Flex
        alignItems="center"
        gap={{ base: '1rem', md: '1.6rem' }}
        marginBlock="2rem"
        flexDir={{ base: 'column', md: 'row' }}
        paddingInline={{ base: '2rem', md: 0 }}
      >
        <Input />
        <Image
          src={arrowExchange}
          alt={translate('altExchange')}
          width="2.4rem"
          height="2.4rem"
        />
        <Input />
      </Flex>

      <Heading
        w="100%"
        maxW="61rem"
        color="textPrimary"
        data-testid="subtitle"
        textAlign={{ base: 'center', md: 'left' }}
      >
        {translate('subtitle')}
      </Heading>

      <Box w={{ base: '90%', md: '50%' }}>
        <Chart data={data} />
      </Box>

      <Footer />
    </Box>
  );
}
