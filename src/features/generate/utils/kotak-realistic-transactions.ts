/**
 * Kotak Mahindra Bank Realistic Transaction Generator
 * 
 * Based on modern Kotak Bank statement patterns:
 * - Reference Format: UTR{16-digits} or {12-digits} (e.g., UTR2341756289043217, 341756289043)
 * - UPI Format: UPI/{ref}/From:{sender}@{handle}/To:{recipient}@{handle}/{app}
 * - Modern transaction mix: ~88% UPI, ~7% IMPS/NEFT, ~5% ATM/Card/Others
 * - UPI handles: @kotak, @ybl, @paytm, @okaxis, @okicici, @oksbi, @ibl
 * - Kotak is very UPI-focused with excellent digital banking
 */

// Kotak Bank reference number formats
export const generateKotakReference = (date: Date, rng: () => number): string => {
  const format = rng();
  
  if (format < 0.6) {
    // UTR format (60%)
    const digits = Math.floor(rng() * 9000000000000000 + 1000000000000000); // 16 digits
    return `UTR${digits}`;
  } else {
    // Simple 12-digit reference (40%)
    const digits = Math.floor(rng() * 900000000000 + 100000000000);
    return `${digits}`;
  }
};

// Common UPI handles for Kotak Bank transactions
const UPI_HANDLES = [
  '@kotak',    // Kotak's own UPI (very common)
  '@ybl',      // PhonePe/YES Bank (most popular)
  '@paytm',    // Paytm
  '@okaxis',   // Axis Bank
  '@okicici',  // ICICI Bank
  '@oksbi',    // SBI
  '@ibl',      // IndusInd Bank
  '@axl',      // Axis Lib
];

// Generate a person VPA (phone number based)
const generatePersonVPA = (rng: () => number): string => {
  const phone = Math.floor(rng() * 900000000 + 7000000000); // 10-digit starting with 7-9
  const handle = UPI_HANDLES[Math.floor(rng() * UPI_HANDLES.length)];
  
  // Sometimes add suffix for multiple accounts
  if (rng() < 0.15) {
    const suffix = Math.floor(rng() * 9 + 1);
    return `${phone}-${suffix}${handle}`;
  }
  
  return `${phone}${handle}`;
};

// Generate Q-code VPA (merchant QR codes)
const generateQCodeVPA = (rng: () => number): string => {
  const qNumber = Math.floor(rng() * 900000000 + 100000000); // 9 digits
  return `Q${qNumber}@ybl`;
};

// Generate Paytm QR code
const generatePaytmQR = (rng: () => number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(rng() * chars.length)];
  }
  return `paytmqr${hash}@ptys`;
};

// Generate business VPA
const generateBusinessVPA = (rng: () => number): string => {
  const onlineBusinesses = [
    'amazon', 'flipkart', 'swiggy', 'zomato', 'uber', 'ola',
    'myntra', 'ajio', 'meesho', 'blinkit', 'zepto', 'dunzo',
    'bigbasket', 'jiomart', 'makemytrip', 'goibibo', 'bookmyshow',
    'paytmmall', 'netmeds', 'pharmeasy', 'lenskart', 'nykaa',
    'urbancompany', 'olacabs', 'rapido', 'porter'
  ];
  
  const localBusinesses = [
    'rameshhardware', 'laxmikirana', 'shreejimobiles', 'ganeshstores',
    'sainathtextiles', 'radhakrishnaelectronics', 'shiventerprises',
    'maheshwaritraders', 'jainbrothers', 'prakashmedical', 'dixitjewellers',
    'agrawalsweets', 'guptaopticals', 'sharmabooks', 'vermafashion'
  ];
  
  const isLocal = rng() < 0.35;
  const businessList = isLocal ? localBusinesses : onlineBusinesses;
  const business = businessList[Math.floor(rng() * businessList.length)];
  
  if (isLocal) {
    // Local business with numbers
    const numbers = Math.floor(rng() * 90000000 + 10000000);
    const handles = ['@hdfcbank', '@okicici', '@okaxis', '@kotak'];
    const handle = handles[Math.floor(rng() * handles.length)];
    return `${business}.${numbers}${handle}`;
  } else {
    // Online business
    const handles = ['@paytm', '@ybl', '@axisbank', '@kotak'];
    const handle = handles[Math.floor(rng() * handles.length)];
    return `${business}.${handle}`;
  }
};

// Generate Vyapar/business accounting VPA
const generateVyaparVPA = (rng: () => number): string => {
  const numbers = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  return `Vyapar.${numbers}@hdfcbank`;
};

// UPI apps distribution (Kotak users tend to use PhonePe and Google Pay heavily)
const UPI_APPS = [
  { name: 'PhonePe', weight: 0.40 },
  { name: 'Google Pay', weight: 0.35 },
  { name: 'Paytm', weight: 0.12 },
  { name: 'BHIM', weight: 0.06 },
  { name: 'Amazon Pay', weight: 0.04 },
  { name: 'WhatsApp', weight: 0.03 },
];

const getUpiApp = (rng: () => number): string => {
  const rand = rng();
  let cumulative = 0;
  for (const app of UPI_APPS) {
    cumulative += app.weight;
    if (rand < cumulative) return app.name;
  }
  return 'PhonePe';
};

// Generate realistic UPI debit transaction
const generateKotakUpiDebit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const from = generatePersonVPA(rng);
  
  // Recipient distribution for debit (payments made)
  const recipientType = rng();
  let to: string;
  
  if (recipientType < 0.30) {
    // 30% Q-code merchants (retail, grocery, petrol)
    to = generateQCodeVPA(rng);
  } else if (recipientType < 0.50) {
    // 20% Paytm QR
    to = generatePaytmQR(rng);
  } else if (recipientType < 0.75) {
    // 25% Business VPAs (online shopping, food delivery)
    to = generateBusinessVPA(rng);
  } else if (recipientType < 0.92) {
    // 17% Person to person
    to = generatePersonVPA(rng);
  } else {
    // 8% Vyapar (bill payments)
    to = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/${app}`;
};

// Generate realistic UPI credit transaction
const generateKotakUpiCredit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const to = generatePersonVPA(rng); // Your VPA
  
  // Sender distribution for credit (money received)
  const senderType = rng();
  let from: string;
  
  if (senderType < 0.70) {
    // 70% Person to person (friends, family)
    from = generatePersonVPA(rng);
  } else if (senderType < 0.88) {
    // 18% Business (refunds, payments)
    from = generateBusinessVPA(rng);
  } else {
    // 12% Vyapar (business income)
    from = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/${app}`;
};

// Generate other transaction types
const OTHER_DEBIT_TYPES = [
  { type: 'ATM', weight: 0.30, generator: (rng: () => number) => {
    const atmId = Math.floor(rng() * 900000 + 100000);
    const location = ['KOTAK ATM ', 'ATM WDL '][Math.floor(rng() * 2)];
    return `${location}${atmId}`;
  }},
  { type: 'IMPS', weight: 0.25, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/TO BENEFICIARY`;
  }},
  { type: 'NEFT', weight: 0.20, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 9000000000 + 1000000000);
    return `NEFT OUT-${ref}`;
  }},
  { type: 'CARD', weight: 0.15, generator: (rng: () => number) => {
    const merchants = ['AMAZON', 'FLIPKART', 'SWIGGY', 'ZOMATO', 'BIG BAZAAR', 'DMART'];
    const merchant = merchants[Math.floor(rng() * merchants.length)];
    return `CARD PURCHASE-${merchant}`;
  }},
  { type: 'CHARGES', weight: 0.10, generator: () => {
    const charges = ['SMS CHARGES', 'DEBIT CARD AMC', 'ANNUAL CHARGES', 'ACCOUNT MAINT FEE'];
    return charges[Math.floor(Math.random() * charges.length)];
  }},
];

const generateOtherDebit = (rng: () => number): string => {
  const rand = rng();
  let cumulative = 0;
  for (const type of OTHER_DEBIT_TYPES) {
    cumulative += type.weight;
    if (rand < cumulative) return type.generator(rng);
  }
  return OTHER_DEBIT_TYPES[0].generator(rng);
};

const OTHER_CREDIT_TYPES = [
  { type: 'NEFT', weight: 0.45, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 9000000000 + 1000000000);
    return `NEFT IN-${ref}`;
  }},
  { type: 'IMPS', weight: 0.35, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/FROM REMITTER`;
  }},
  { type: 'CASH', weight: 0.12, generator: () => 'CASH DEPOSIT' },
  { type: 'INTEREST', weight: 0.08, generator: () => 'INTEREST CREDITED' },
];

const generateOtherCredit = (rng: () => number): string => {
  const rand = rng();
  let cumulative = 0;
  for (const type of OTHER_CREDIT_TYPES) {
    cumulative += type.weight;
    if (rand < cumulative) return type.generator(rng);
  }
  return OTHER_CREDIT_TYPES[0].generator(rng);
};

// Salary credit generator for Kotak
export const generateKotakSalaryCredit = (employer: string, rng: () => number): string => {
  const format = rng();
  
  if (format < 0.6) {
    // NEFT salary credit (60%)
    const ref = Math.floor(rng() * 9000000000 + 1000000000);
    return `NEFT IN-${ref}-${employer.toUpperCase()}`;
  } else if (format < 0.9) {
    // IMPS salary credit (30%)
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/${employer.toUpperCase()}-SAL`;
  } else {
    // Direct credit (10%)
    return `SAL CREDIT-${employer.toUpperCase()}`;
  }
};

// Main transaction generator
export const generateKotakRealisticTransaction = (
  type: 'debit' | 'credit',
  date: Date,
  rng: () => number
): { description: string; reference: string } => {
  const isUpi = rng() < (type === 'debit' ? 0.88 : 0.85); // 88% debit, 85% credit are UPI
  
  if (isUpi) {
    const description = type === 'debit' 
      ? generateKotakUpiDebit(rng)
      : generateKotakUpiCredit(rng);
    return {
      description,
      reference: generateKotakReference(date, rng),
    };
  } else {
    const description = type === 'debit'
      ? generateOtherDebit(rng)
      : generateOtherCredit(rng);
    return {
      description,
      reference: generateKotakReference(date, rng),
    };
  }
};

