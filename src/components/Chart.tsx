import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { useMediaQuery } from '@chakra-ui/react';

export type ChartProps = {
  data: [];
};

const Chart = ({ data }: ChartProps) => {
  const [responsive] = useMediaQuery('(min-width: 900px)');

  return (
    <ResponsiveContainer width="100%" height={responsive ? 400 : 250}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: responsive ? 30 : 40,
          left: responsive ? 20 : 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="name" fill="#8884d8" />
        <Bar dataKey="priceUsd" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
