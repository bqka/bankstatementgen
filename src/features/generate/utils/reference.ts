import { randomInt, shuffle } from '@/utils/random';

const SALARY_PREFIXES = ['BULKPOSTING', 'SALPAY', 'NEFT', 'IMPS'];
const BANK_CODES = ['AXIS', 'HDFC', 'ICICI', 'SBI', 'PNB'];
const EMPLOYER_CODES = ['BJFIN', 'INFY', 'TECHM', 'WIPRO', 'PAYTM', 'KOTAK'];

export const buildReference = (label: string, rng: () => number) => {
  if (label.toLowerCase().includes('salary')) {
    const prefix = SALARY_PREFIXES[randomInt(0, SALARY_PREFIXES.length - 1, rng)];
    const bank = BANK_CODES[randomInt(0, BANK_CODES.length - 1, rng)];
    const employer = EMPLOYER_CODES[randomInt(0, EMPLOYER_CODES.length - 1, rng)];
    return `${prefix}/${bank}/${employer}`;
  }

  const segments = shuffle(['UPI', 'QR', 'NEFT', 'IMPS'], rng).slice(0, 2);
  const randomNumber = randomInt(1000, 9999, rng);
  return `${segments.join('/')}/${randomNumber}`;
};
