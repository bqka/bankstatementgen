export const formatCurrency = (value: number) => {
  // Simple, Hermes-safe INR formatter (groups lakhs/ thousands)
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const parts = abs.toFixed(2).split('.');
  const intPart = parts[0];
  const decimal = parts[1];

  // Indian grouping: last 3 digits, then groups of 2
  const lastThree = intPart.slice(-3);
  let rest = intPart.slice(0, -3);
  let grouped = lastThree;
  if (rest.length > 0) {
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = rest + ',' + lastThree;
  }
  return `₹${sign}${grouped}.${decimal}`;
};
