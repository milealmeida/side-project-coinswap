import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import { Box } from '@chakra-ui/react';

export type ChartProps = {
  data: {
    [key: string]: string | number;
  }[];
  summary: string;
};

const Chart = ({ data, summary }: ChartProps) => {
  const point = data[0] ?? {};
  const dataKeys = Object.keys(point);
  const fromKey = dataKeys[1];
  const toKey = dataKeys[2];

  return (
    <Box
      as="figure"
      w="100%"
      maxW="60rem"
      m={0}
      paddingInline={{ base: '2rem', md: 0 }}
    >
      <Box height={{ base: '22rem', md: '40rem' }} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: 0,
              bottom: 0
            }}
            barSize={60}
            barGap={24}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Legend />
            {fromKey && <Bar dataKey={fromKey} fill="#7C3AED" />}
            {toKey && <Bar dataKey={toKey} fill="#02A724" />}
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <table data-sr-only>
        <caption>{summary}</caption>
        <thead>
          <tr>
            {fromKey && <th scope="col">{fromKey}</th>}
            {toKey && <th scope="col">{toKey}</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fromKey && <td>{point[fromKey]}</td>}
            {toKey && <td>{point[toKey]}</td>}
          </tr>
        </tbody>
      </table>
    </Box>
  );
};

export default Chart;
