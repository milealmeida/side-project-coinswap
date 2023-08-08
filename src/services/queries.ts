import axios from './axios';

export const getCurrencyValue = async ({
  coin,
  coinin
}: {
  coin: string;
  coinin: string;
}) => {
  return await axios.get(`/last/${coin}-${coinin}`);
};
