export const onlyNumbers = (value: string): string => {
  return value?.replace(/\D/g, '');
};

export const formatValue = (value: string) => {
  return value
    .replace(/[^0-9,\.]/g, '')
    .replace(/,/g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\.(?=.*\.)/g, '');
};
