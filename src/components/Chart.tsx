import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import { Box, useMediaQuery } from '@chakra-ui/react';

export type ChartProps = {
  data: {
    [key: string]: string | number;
  }[];
};

const Chart = ({ data }: ChartProps) => {
  const dataKeys = Object.keys(data[0]);
  const [mobile] = useMediaQuery('(min-width: 768px)');

  return (
    <Box w="100%" height={mobile ? 400 : 200} maxW="60rem">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5
          }}
          barSize={60}
          barGap={60}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Bar dataKey={dataKeys[1]} fill="#7C3AED" width={40} />
          <Bar dataKey={dataKeys[2]} fill="#02A724" width={40} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
