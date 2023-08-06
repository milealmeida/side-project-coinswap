import axios from './axios';

export const GET_CURRENCY_VALUE = async ({
  coin,
  coinin
}: {
  coin: string;
  coinin: string;
}) => {
  return await axios.get(`/last/${coin}-${coinin}`);
};
