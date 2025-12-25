

/**
 * Canara Bank Realistic Transaction Generator
 * 
 * Based on modern Canara Bank statement patterns:
 * - Reference Format: {12-16 digits} or IMPS/{12-digits} or NEFT{12-digits}
 * - UPI Format: UPI/{ref}/From:{sender}@{handle}/To:{recipient}@{handle}/{app}
 * - Modern transaction mix: ~82% UPI, ~10% IMPS/NEFT, ~8% ATM/Card/Others
 * - UPI handles: @cnrb (Canara's own), @ybl, @paytm, @okaxis, @okicici, @oksbi
 * - Canara is rapidly growing in digital banking adoption
 */

// Canara Bank reference number formats
export const generateCanaraReference = (date: Date, rng: () => number): string => {
  const format = rng();
  
  if (format < 0.5) {
    // Simple 12-digit reference (50%)
    const digits = Math.floor(rng() * 900000000000 + 100000000000);
    return `${digits}`;
  } else if (format < 0.8) {
    // 14-digit reference (30%)
    const digits = Math.floor(rng() * 90000000000000 + 10000000000000);
    return `${digits}`;
  } else {
    // 16-digit reference (20%)
    const digits = Math.floor(rng() * 9000000000000000 + 1000000000000000);
    return `${digits}`;
  }
};

// Common UPI handles for Canara Bank transactions
const UPI_HANDLES = [
  '@cnrb',     // Canara Bank's own UPI handle
  '@ybl',      // PhonePe/YES Bank (most popular)
  '@paytm',    // Paytm
  '@okaxis',   // Axis Bank
  '@okicici',  // ICICI Bank
  '@oksbi',    // SBI
  '@ibl',      // IndusInd Bank
  '@upi',      // Generic UPI
];

// Generate a person VPA (phone number based)
const generatePersonVPA = (rng: () => number): string => {
  const phone = Math.floor(rng() * 900000000 + 7000000000); // 10-digit starting with 7-9
  const handle = UPI_HANDLES[Math.floor(rng() * UPI_HANDLES.length)];
  
  // Sometimes add suffix for multiple accounts
  if (rng() < 0.12) {
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
    'myntra', 'ajio', 'meesho', 'blinkit', 'zepto', 'bigbasket',
    'jiomart', 'makemytrip', 'goibibo', 'bookmyshow', 'paytmmall',
    'netmeds', 'pharmeasy', 'lenskart', 'nykaa', 'snapdeal'
  ];
  
  const localBusinesses = [
    'sairamstores', 'lakshmimedical', 'ganeshenterprises', 'shivahardware',
    'radhakrishnaelectronics', 'hanumantraders', 'durgatextiles',
    'saraswatibooks', 'venkateswaramobiles', 'muruganpetroleum',
    'anjaneyadairy', 'krishnasweets', 'balajifurniture', 'nagaopticals'
  ];
  
  const isLocal = rng() < 0.4;
  const businessList = isLocal ? localBusinesses : onlineBusinesses;
  const business = businessList[Math.floor(rng() * businessList.length)];
  
  if (isLocal) {
    // Local business with numbers
    const numbers = Math.floor(rng() * 90000000 + 10000000);
    const handles = ['@hdfcbank', '@okicici', '@cnrb', '@okaxis'];
    const handle = handles[Math.floor(rng() * handles.length)];
    return `${business}.${numbers}${handle}`;
  } else {
    // Online business
    const handles = ['@paytm', '@ybl', '@axisbank', '@cnrb'];
    const handle = handles[Math.floor(rng() * handles.length)];
    return `${business}.${handle}`;
  }
};

// Generate Vyapar/business accounting VPA
const generateVyaparVPA = (rng: () => number): string => {
  const numbers = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  return `Vyapar.${numbers}@hdfcbank`;
};

// UPI apps distribution
const UPI_APPS = [
  { name: 'PhonePe', weight: 0.42 },
  { name: 'Google Pay', weight: 0.32 },
  { name: 'Paytm', weight: 0.14 },
  { name: 'BHIM', weight: 0.07 },
  { name: 'Amazon Pay', weight: 0.03 },
  { name: 'WhatsApp', weight: 0.02 },
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
const generateCanaraUpiDebit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const from = generatePersonVPA(rng);
  
  // Recipient distribution for debit (payments made)
  const recipientType = rng();
  let to: string;
  
  if (recipientType < 0.32) {
    // 32% Q-code merchants (retail, grocery, petrol)
    to = generateQCodeVPA(rng);
  } else if (recipientType < 0.54) {
    // 22% Paytm QR
    to = generatePaytmQR(rng);
  } else if (recipientType < 0.76) {
    // 22% Business VPAs (online shopping, food delivery)
    to = generateBusinessVPA(rng);
  } else if (recipientType < 0.91) {
    // 15% Person to person
    to = generatePersonVPA(rng);
  } else {
    // 9% Vyapar (bill payments)
    to = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/${app}`;
};

// Generate realistic UPI credit transaction
const generateCanaraUpiCredit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const to = generatePersonVPA(rng); // Your VPA
  
  // Sender distribution for credit (money received)
  const senderType = rng();
  let from: string;
  
  if (senderType < 0.72) {
    // 72% Person to person (friends, family)
    from = generatePersonVPA(rng);
  } else if (senderType < 0.89) {
    // 17% Business (refunds, payments)
    from = generateBusinessVPA(rng);
  } else {
    // 11% Vyapar (business income)
    from = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/${app}`;
};

// Generate other transaction types
const OTHER_DEBIT_TYPES = [
  { type: 'ATM', weight: 0.35, generator: (rng: () => number) => {
    const atmId = Math.floor(rng() * 900000 + 100000);
    const location = ['ATM WDL-', 'CANARA ATM-'][Math.floor(rng() * 2)];
    return `${location}${atmId}`;
  }},
  { type: 'IMPS', weight: 0.25, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/TRANSFER`;
  }},
  { type: 'NEFT', weight: 0.20, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `NEFT${ref}`;
  }},
  { type: 'POS', weight: 0.12, generator: (rng: () => number) => {
    const merchants = ['DMart', 'Big Bazaar', 'Reliance', 'More', 'Spencers', 'Hypercity'];
    const merchant = merchants[Math.floor(rng() * merchants.length)];
    return `POS-${merchant}`;
  }},
  { type: 'CHARGES', weight: 0.08, generator: () => {
    const charges = ['SMS CHARGES', 'DEBIT CARD ANNUAL FEE', 'ACCOUNT CHARGES', 'CHEQUE BOOK'];
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
  { type: 'NEFT', weight: 0.48, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `NEFT${ref}/CR`;
  }},
  { type: 'IMPS', weight: 0.32, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/CREDIT`;
  }},
  { type: 'CASH', weight: 0.13, generator: () => 'CASH DEPOSIT' },
  { type: 'INTEREST', weight: 0.07, generator: () => 'INTEREST CREDIT' },
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

// Salary credit generator for Canara
export const generateCanaraSalaryCredit = (employer: string, rng: () => number): string => {
  const format = rng();
  
  if (format < 0.55) {
    // NEFT salary credit (55%)
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `NEFT${ref}/${employer.toUpperCase()}/SALARY`;
  } else if (format < 0.85) {
    // IMPS salary credit (30%)
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/${employer.toUpperCase()}-SAL`;
  } else {
    // Direct salary transfer (15%)
    return `SALARY CREDIT-${employer.toUpperCase()}`;
  }
};

// Main transaction generator
export const generateCanaraRealisticTransaction = (
  type: 'debit' | 'credit',
  date: Date,
  rng: () => number
): { description: string; reference: string } => {
  const isUpi = rng() < (type === 'debit' ? 0.82 : 0.78); // 82% debit, 78% credit are UPI
  
  if (isUpi) {
    const description = type === 'debit' 
      ? generateCanaraUpiDebit(rng)
      : generateCanaraUpiCredit(rng);
    return {
      description,
      reference: generateCanaraReference(date, rng),
    };
  } else {
    const description = type === 'debit'
      ? generateOtherDebit(rng)
      : generateOtherCredit(rng);
    return {
      description,
      reference: generateCanaraReference(date, rng),
    };
  }
};

