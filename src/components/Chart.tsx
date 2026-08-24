import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { Box, Text } from '@chakra-ui/react';

import { useColorModeValue } from 'components/ui/color-mode';
import { HistoryPoint } from 'hooks/useQuoteHistory';
import { dark, light } from 'styles/global';

export type ChartProps = {
  data: HistoryPoint[];
  summary: string;
  rateLabel: string;
  dateLabel: string;
  message?: string;
};

const Chart = ({
  data,
  summary,
  rateLabel,
  dateLabel,
  message
}: ChartProps) => {
  const tickColor = useColorModeValue(light.textSecondary, dark.textSecondary);
  const tooltipBg = useColorModeValue(light.bgColor, dark.bgColor);
  const tooltipColor = useColorModeValue(light.textPrimary, dark.textPrimary);
  const tickInterval = data.length > 8 ? Math.ceil(data.length / 7) - 1 : 0;
  const showMessage = Boolean(message && data.length === 0);

  return (
    <Box
      as="figure"
      position="relative"
      w="100%"
      maxW="60rem"
      m={0}
      paddingInline={{ base: '2rem', md: 0 }}
    >
      <Box
        position="relative"
        height={{ base: '22rem', md: '40rem' }}
        aria-hidden={data.length ? 'true' : undefined}
      >
        {showMessage ? (
          <Text
            color="textSecondary"
            fontSize="1.4rem"
            textAlign="center"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {message}
          </Text>
        ) : (
          <Box position="absolute" inset="0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={tickColor} strokeOpacity={0.2} />
                <XAxis
                  dataKey="date"
                  stroke={tickColor}
                  tick={{ fontSize: 12 }}
                  interval={tickInterval}
                />
                <YAxis
                  stroke={tickColor}
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tickColor}`,
                    color: tooltipColor,
                    fontSize: '1.4rem'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name={rateLabel}
                  stroke="#02A724"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
      {data.length > 0 && (
        <Box data-sr-only>
          <table>
            <caption>{summary}</caption>
            <thead>
              <tr>
                <th scope="col">{dateLabel}</th>
                <th scope="col">{rateLabel}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={`${point.date}-${point.rate}`}>
                  <td>{point.date}</td>
                  <td>{point.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
};

export default Chart;
