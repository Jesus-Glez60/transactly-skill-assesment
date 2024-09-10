export const roundNumber = (num: number, decimalPlaces = 0) => {
  const factor = 10 ** decimalPlaces;
  return Math.round(num * factor) / factor;
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};
