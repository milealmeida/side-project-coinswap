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

export type ChartProps = {
  data: [];
};

const Chart = ({ data }: ChartProps) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
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

export default Chart;
