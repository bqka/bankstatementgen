import { randomInt, randomFloat } from '@/utils/random';

// Real Indian names for UPI transactions
const INDIAN_NAMES = [
  'SATENDRA SINGH PARIHAR', 'DEVANSHU MISHRA', 'RAVI SADHWANI', 'JYOTI SISODIYA',
  'DHARMENDRA VISHWAKA', 'AADHAR HOUSING', 'DEVANSH MISHRA', 'RAVI SADHWANI',
  'SATENDRA SINGH', 'MISHRA', 'SADHWANI', 'SISODIYA', 'VISHWAKA', 'PARIHAR'
];

// Bank codes used in India for HDFC statements
const BANK_CODES = [
  'ICIC', 'SBIN', 'HDFC', 'AXIS', 'YESB', 'KKBK', 'PUNB', 'UBIN', 'IDIB'
];

// Cities
const CITIES = ['BHOPAL', 'DELHI', 'MUMBAI', 'PUNE', 'BANGALORE', 'CHENNAI'];

// Generate realistic UPI transaction for HDFC
export const generateHdfcUpiTransaction = (
  isCredit: boolean,
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const name = INDIAN_NAMES[randomInt(0, INDIAN_NAMES.length - 1, rng)];
  const bankCode = BANK_CODES[randomInt(0, BANK_CODES.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const upiRef = randomInt(300000000000, 399999999999, rng);
  
  const direction = isCredit ? 'CR' : 'DR';
  const prefix = isCredit ? 'UPI' : 'UPI';
  
  // Format similar to: UPI-SATENDRA SINGH PARIH-7415002323@AXL-ICIC0000055-344318594283-PAYMENT FROM PH ONE
  const narration = `${prefix}-${name.substring(0, 20)}-${randomInt(1000000000, 9999999999, rng)}@${
    ['AXL', 'YBL', 'PAYTM', 'OK'][randomInt(0, 3, rng)]
  }-${bankCode}${String(randomInt(0, 999999, rng)).padStart(7, '0')}-${refNumber}-PAYMENT ${isCredit ? 'FROM' : 'TO'} PH ONE`;
  
  const chqRefNo = String(upiRef);
  
  // UPI amounts - REALISTIC tiered distribution to avoid red flags
  let amount: number;
  if (isCredit) {
    const creditType = rng();
    if (creditType < 0.7) {
      amount = randomFloat(100, 2000, 2, rng); // 70% small amounts
    } else if (creditType < 0.9) {
      amount = randomFloat(2000, 5000, 2, rng); // 20% medium
    } else {
      amount = randomFloat(5000, 10000, 2, rng); // 10% larger (rarely)
    }
  } else {
    const debitType = rng();
    if (debitType < 0.75) {
      amount = randomFloat(50, 1500, 2, rng); // 75% small transactions
    } else if (debitType < 0.92) {
      amount = randomFloat(1500, 4000, 2, rng); // 17% medium
    } else {
      amount = randomFloat(4000, 8000, 2, rng); // 8% larger (rare)
    }
  }
  
  return { narration, chqRefNo, amount };
};

// Generate NEFT transaction
export const generateHdfcNeftTransaction = (
  isCredit: boolean,
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const name = INDIAN_NAMES[randomInt(0, INDIAN_NAMES.length - 1, rng)];
  const bankCode = BANK_CODES[randomInt(0, BANK_CODES.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const institutions = [
    'AADHAR HOUSING FINANCE LIMITED',
    'UTIB',
    'AXIS BANK',
    'ICICI BANK'
  ];
  const institution = institutions[randomInt(0, institutions.length - 1, rng)];
  
  const prefix = isCredit ? 'NEFT CR' : 'NEFT';
  
  const narration = `${prefix}-${bankCode}${String(randomInt(0, 999999999, rng)).padStart(10, '0')}-${institution}-${name}-AXISP ${String(refNumber).substring(0, 12)}`;
  
  const chqRefNo = `AXISP${String(randomInt(100000000, 999999999, rng))}`;
  
  // NEFT amounts - REALISTIC tiered distribution
  let amount: number;
  if (isCredit) {
    const neftType = rng();
    if (neftType < 0.7) {
      amount = randomFloat(2000, 8000, 2, rng); // 70% moderate
    } else if (neftType < 0.9) {
      amount = randomFloat(8000, 15000, 2, rng); // 20% medium
    } else {
      amount = randomFloat(15000, 25000, 2, rng); // 10% larger
    }
  } else {
    const neftType = rng();
    if (neftType < 0.7) {
      amount = randomFloat(1500, 5000, 2, rng); // 70% moderate
    } else if (neftType < 0.9) {
      amount = randomFloat(5000, 10000, 2, rng); // 20% medium
    } else {
      amount = randomFloat(10000, 18000, 2, rng); // 10% larger
    }
  }
  
  return { narration, chqRefNo, amount };
};

// Generate autopay/SEDT transaction
export const generateHdfcAutopayTransaction = (
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  const narration = `CC ${String(refNumber).substring(0, 13)} AUTOPAY SI-TAD`;
  const chqRefNo = String(randomInt(100000000000, 999999999999, rng));
  
  const amount = randomFloat(500, 10000, 2, rng);
  
  return { narration, chqRefNo, amount };
};

// Generate installment payment
export const generateHdfcInstallmentTransaction = (
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const name = INDIAN_NAMES[randomInt(0, INDIAN_NAMES.length - 1, rng)];
  const refNumber = randomInt(1000, 9999, rng);
  
  const narration = `RD BOOKED/INSTALLMENT PAID -${randomInt(1000000000, 9999999999, rng)}/${refNumber}-${name}`;
  const chqRefNo = String(randomInt(100000000000, 999999999999, rng));
  
  const amount = randomFloat(500, 5000, 2, rng);
  
  return { narration, chqRefNo, amount };
};

// Generate debit card transaction
export const generateHdfcDebitCardTransaction = (
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const merchants = [
    'OCTDEC22 INSTAALERTCHG 2 SMS',
    'GOOGLE PAYMENT',
    'AMAZON PAY',
    'SWIGGY',
    'ZOMATO',
    'BIG BAZAAR',
    'DMart'
  ];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  const narration = merchant.includes('SMS') 
    ? `${merchant} ${String(refNumber).substring(0, 12)}`
    : `DC-${merchant}-${String(refNumber).substring(0, 10)}`;
  
  const chqRefNo = merchant.includes('SMS')
    ? `MIR2${String(refNumber).substring(0, 12)}`
    : String(randomInt(100000000000, 999999999999, rng));
  
  const amount = merchant.includes('SMS')
    ? randomFloat(0.1, 10, 2, rng)
    : randomFloat(100, 3000, 2, rng);
  
  return { narration, chqRefNo, amount };
};

// Generate ACH debit (loan EMI, etc.)
export const generateHdfcAchDebitTransaction = (
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  const institutions = [
    'AADHAR HOUSING FINAN',
    'BAJAJ FINANCE',
    'HDFC BANK LTD',
    'ICICI BANK'
  ];
  const institution = institutions[randomInt(0, institutions.length - 1, rng)];
  const refNumber = randomInt(10000000000, 99999999999, rng);
  
  const narration = `ACH D- ${institution}-V${randomInt(10000000000, 99999999999, rng)}`;
  const chqRefNo = String(randomInt(100000000000, 999999999999, rng));
  
  const amount = randomFloat(1000, 10000, 2, rng);
  
  return { narration, chqRefNo, amount };
};

// Main function to generate a random realistic HDFC transaction
export const generateRealisticHdfcTransaction = (
  type: 'credit' | 'debit',
  rng: () => number
): { narration: string; chqRefNo: string; amount: number } => {
  let txnData: { narration: string; chqRefNo: string; amount: number };
  
  if (type === 'credit') {
    const creditTypes = [
      { weight: 60, fn: () => generateHdfcUpiTransaction(true, rng) },
      { weight: 30, fn: () => generateHdfcNeftTransaction(true, rng) },
      { weight: 10, fn: () => generateHdfcInstallmentTransaction(rng) }
    ];
    
    const totalWeight = creditTypes.reduce((sum, t) => sum + t.weight, 0);
    let random = randomInt(1, totalWeight, rng);
    
    for (const txnType of creditTypes) {
      if (random <= txnType.weight) {
        txnData = txnType.fn();
        break;
      }
      random -= txnType.weight;
    }
    
    txnData = txnData! || creditTypes[0].fn();
  } else {
    const debitTypes = [
      { weight: 50, fn: () => generateHdfcUpiTransaction(false, rng) },
      { weight: 20, fn: () => generateHdfcDebitCardTransaction(rng) },
      { weight: 15, fn: () => generateHdfcAchDebitTransaction(rng) },
      { weight: 10, fn: () => generateHdfcAutopayTransaction(rng) },
      { weight: 5, fn: () => generateHdfcNeftTransaction(false, rng) }
    ];
    
    const totalWeight = debitTypes.reduce((sum, t) => sum + t.weight, 0);
    let random = randomInt(1, totalWeight, rng);
    
    for (const txnType of debitTypes) {
      if (random <= txnType.weight) {
        txnData = txnType.fn();
        break;
      }
      random -= txnType.weight;
    }
    
    txnData = txnData! || debitTypes[0].fn();
  }
  
  return txnData;
};
