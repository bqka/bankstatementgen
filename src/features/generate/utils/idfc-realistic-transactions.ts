import { randomInt } from '@/utils/random';
import { addDays, format } from 'date-fns';

/**
 * IDFC First Bank Realistic Transaction Generator
 * Based on actual IDFC statement formats
 */

// Default RNG function for IDFC transactions
const defaultRng = () => Math.random();

// Common UPI providers and services for IDFC
const upiProviders = [
  { name: 'PhonePe', upiId: '@ybl' },
  { name: 'Google Pay', upiId: '@oksbi' },
  { name: 'Paytm', upiId: '@paytm' },
  { name: 'Amazon Pay', upiId: '@apl' },
  { name: 'BHIM', upiId: '@upi' },
];

// Common names for UPI transactions
const personNames = [
  'SATENDRA SINGH',
  'DEVENDRA',
  'RAVI KUMAR',
  'ANJALI SHARMA',
  'PRIYA PATEL',
  'RAHUL VERMA',
  'SUNITA GUPTA',
  'AMIT SINGH',
  'KRISHNA YADAV',
  'NEHA MISHRA',
];

// Common merchants and services
const merchants = [
  'SWIGGY',
  'ZOMATO',
  'AMAZON',
  'FLIPKART',
  'RELIANCE DIGITAL',
  'DMart',
  'Big Bazaar',
  'Myntra',
  'Uber',
  'Ola',
];

// EMI/Loan services
const loanServices = [
  'BAJAJ FINSERV',
  'HDFC BANK',
  'ICICI BANK',
  'TATA CAPITAL',
  'HOME CREDIT',
];

/**
 * Generate UPI/MOB payment transaction
 */
export const generateIdfcUpiTransaction = (date: Date): { description: string; amount: number } => {
  const provider = upiProviders[randomInt(0, upiProviders.length - 1, defaultRng)];
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  
  const type = randomInt(1, 4, defaultRng);
  
  if (type === 1) {
    // UPI/MOB payment from app
    const description = `UPI/MOB/${refNumber}/Payment from ${provider.name}`;
    return { description, amount: randomInt(100, 5000, defaultRng) };
  } else if (type === 2) {
    // UPI DR - Payment request
    const name = personNames[randomInt(0, personNames.length - 1, defaultRng)];
    const upiRef = randomInt(100000000000, 999999999999, defaultRng).toString();
    const phoneDigits = randomInt(1000000, 9999999, defaultRng).toString();
    const description = `UPI/DR/${upiRef}/${name}/${phoneDigits}/Pay req`;
    return { description, amount: randomInt(500, 8000, defaultRng) };
  } else if (type === 3) {
    // UPI CR - Credit from person - REALISTIC tiered amounts
    const name = personNames[randomInt(0, personNames.length - 1, defaultRng)];
    const upiRef = randomInt(100000000000, 999999999999, defaultRng).toString();
    const phoneDigits = randomInt(1000000, 9999999, defaultRng).toString();
    const description = `UPI/CR/${upiRef}/${name}/${phoneDigits}/Received`;
    
    // Tiered credit amounts
    const creditType = defaultRng();
    let creditAmount: number;
    if (creditType < 0.7) {
      creditAmount = randomInt(200, 2500, defaultRng); // 70% small
    } else if (creditType < 0.9) {
      creditAmount = randomInt(2500, 5000, defaultRng); // 20% medium
    } else {
      creditAmount = randomInt(5000, 10000, defaultRng); // 10% larger
    }
    return { description, amount: -creditAmount }; // Negative for credit
  } else {
    // Merchant payment
    const merchant = merchants[randomInt(0, merchants.length - 1, defaultRng)];
    const description = `UPI/MOB/${refNumber}/Payment to ${merchant}`;
    return { description, amount: randomInt(200, 3000, defaultRng) };
  }
};

/**
 * Generate EMI debit transaction
 */
export const generateIdfcEmiTransaction = (date: Date): { description: string; amount: number } => {
  const service = loanServices[randomInt(0, loanServices.length - 1, defaultRng)];
  const refNumber = randomInt(100000000, 999999999, defaultRng).toString();
  
  const emiAmount = [2500, 3000, 3500, 4000, 5000, 6000, 7500, 8000, 10000];
  const amount = emiAmount[randomInt(0, emiAmount.length - 1, defaultRng)];
  
  const description = `EMI DEBIT ${refNumber}`;
  
  return { description, amount };
};

/**
 * Generate MATM/AEPS transaction
 */
export const generateIdfcMatmTransaction = (date: Date): { description: string; amount: number } => {
  const transactionId = randomInt(10000000, 99999999, defaultRng).toString();
  const rrn = randomInt(100000000000, 999999999999, defaultRng).toString();
  const branch = 'VIDISHA BRANCH';
  const phoneDigits = randomInt(90000000, 99999999, defaultRng).toString();
  
  const description = `MATM/AEPS/CD/${transactionId}/${rrn}/${branch}/${phoneDigits}/Self`;
  const amount = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000][randomInt(0, 7, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate monthly interest credit
 */
export const generateIdfcInterestCredit = (date: Date): { description: string; amount: number } => {
  const description = 'MONTHLY SAVINGS INTEREST CREDIT';
  const amount = -randomInt(50, 500, defaultRng); // Negative for credit
  
  return { description, amount };
};

/**
 * Generate NEFT transaction
 */
export const generateIdfcNeftTransaction = (date: Date): { description: string; amount: number } => {
  const type = randomInt(1, 2, defaultRng);
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  
  if (type === 1) {
    // NEFT debit - REALISTIC tiered amounts
    const name = personNames[randomInt(0, personNames.length - 1, defaultRng)];
    const description = `NEFT/DR/${refNumber}/${name}/Transfer`;
    
    const neftType = defaultRng();
    let amount: number;
    if (neftType < 0.7) {
      amount = randomInt(1500, 5000, defaultRng); // 70% moderate
    } else if (neftType < 0.9) {
      amount = randomInt(5000, 10000, defaultRng); // 20% medium
    } else {
      amount = randomInt(10000, 18000, defaultRng); // 10% larger
    }
    return { description, amount };
  } else {
    // NEFT credit - REALISTIC tiered amounts
    const name = personNames[randomInt(0, personNames.length - 1, defaultRng)];
    const description = `NEFT/CR/${refNumber}/${name}/Received`;
    
    const neftType = defaultRng();
    let creditAmount: number;
    if (neftType < 0.7) {
      creditAmount = randomInt(2000, 8000, defaultRng); // 70% moderate
    } else if (neftType < 0.9) {
      creditAmount = randomInt(8000, 15000, defaultRng); // 20% medium
    } else {
      creditAmount = randomInt(15000, 25000, defaultRng); // 10% larger
    }
    return { description, amount: -creditAmount }; // Negative for credit
  }
};

/**
 * Generate ATM withdrawal
 */
export const generateIdfcAtmWithdrawal = (date: Date): { description: string; amount: number } => {
  const atmId = randomInt(100000, 999999, defaultRng).toString();
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  
  const description = `ATM WDL/${atmId}/${refNumber}/VIDISHA`;
  const amount = [500, 1000, 2000, 2500, 3000, 4000, 5000, 10000][randomInt(0, 7, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate POS transaction
 */
export const generateIdfcPosTransaction = (date: Date): { description: string; amount: number } => {
  const merchant = merchants[randomInt(0, merchants.length - 1, defaultRng)];
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  
  const description = `POS/${refNumber}/${merchant}/VIDISHA`;
  const amount = randomInt(500, 8000, defaultRng);
  
  return { description, amount };
};

/**
 * Generate mandate/autopay debit
 */
export const generateIdfcMandateDebit = (date: Date): { description: string; amount: number } => {
  const services = [
    'NETFLIX SUBSCRIPTION',
    'AMAZON PRIME MEMBERSHIP',
    'SPOTIFY PREMIUM',
    'JIO POSTPAID',
    'AIRTEL POSTPAID',
    'INSURANCE PREMIUM',
  ];
  
  const service = services[randomInt(0, services.length - 1, defaultRng)];
  const refNumber = randomInt(100000000, 999999999, defaultRng).toString();
  
  const description = `MANDATE DEBIT/${refNumber}/${service}`;
  const amounts = [199, 299, 399, 499, 599, 999, 1499, 2000, 2500];
  const amount = amounts[randomInt(0, amounts.length - 1, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate service charges
 */
export const generateIdfcServiceCharge = (date: Date): { description: string; amount: number } => {
  const charges = [
    'DEBIT CARD AMC',
    'SMS ALERT CHARGES',
    'ACCOUNT MAINTENANCE CHARGES',
    'CHEQUE BOOK CHARGES',
  ];
  
  const charge = charges[randomInt(0, charges.length - 1, defaultRng)];
  const description = `${charge}`;
  const amounts = [50, 100, 150, 200, 250, 300];
  const amount = amounts[randomInt(0, amounts.length - 1, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate mobile recharge
 */
export const generateIdfcMobileRecharge = (date: Date): { description: string; amount: number } => {
  const operators = ['JIO', 'AIRTEL', 'VI', 'BSNL'];
  const operator = operators[randomInt(0, operators.length - 1, defaultRng)];
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  
  const description = `UPI/MOB/${refNumber}/Mobile Recharge ${operator}`;
  const amounts = [199, 299, 399, 499, 699, 999];
  const amount = amounts[randomInt(0, amounts.length - 1, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate DTH recharge
 */
export const generateIdfcDthRecharge = (date: Date): { description: string; amount: number } => {
  const providers = ['TATA SKY', 'DISH TV', 'AIRTEL DIGITAL TV', 'VIDEOCON D2H'];
  const provider = providers[randomInt(0, providers.length - 1, defaultRng)];
  const refNumber = randomInt(100000000000, 999999999, defaultRng).toString();
  
  const description = `UPI/MOB/${refNumber}/DTH Recharge ${provider}`;
  const amounts = [300, 400, 500, 600, 800, 1000];
  const amount = amounts[randomInt(0, amounts.length - 1, defaultRng)];
  
  return { description, amount };
};

/**
 * Generate cash deposit
 */
export const generateIdfcCashDeposit = (date: Date): { description: string; amount: number } => {
  const refNumber = randomInt(100000000000, 999999999999, defaultRng).toString();
  const description = `CASH DEPOSIT/${refNumber}/VIDISHA BRANCH`;
  
  // REALISTIC tiered cash deposit amounts
  const depositType = defaultRng();
  let creditAmount: number;
  if (depositType < 0.60) {
    creditAmount = randomInt(3000, 10000, defaultRng); // 60% small deposits
  } else if (depositType < 0.85) {
    creditAmount = randomInt(10000, 20000, defaultRng); // 25% medium
  } else {
    creditAmount = randomInt(20000, 35000, defaultRng); // 15% larger
  }
  
  return { description, amount: -creditAmount }; // Negative for credit
};

/**
 * Generate salary credit
 */
export const generateIdfcSalaryCredit = (date: Date, employerName?: string): { description: string; amount: number } => {
  const employer = employerName || 'ABC COMPANY';
  const description = `SALARY CREDIT/${employer}/NEFT`;
  const amount = -randomInt(30000, 100000, defaultRng); // Negative for credit
  
  return { description, amount };
};

/**
 * Generate random realistic IDFC transaction
 */
export const generateIdfcRealisticTransaction = (date: Date): { description: string; amount: number } => {
  const transactionTypes = [
    generateIdfcUpiTransaction,
    generateIdfcUpiTransaction, // Higher probability
    generateIdfcUpiTransaction, // Higher probability
    generateIdfcPosTransaction,
    generateIdfcAtmWithdrawal,
    generateIdfcMobileRecharge,
    generateIdfcDthRecharge,
    generateIdfcMandateDebit,
  ];
  
  const generator = transactionTypes[randomInt(0, transactionTypes.length - 1, defaultRng)];
  return generator(date);
};
