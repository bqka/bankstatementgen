

/**
 * UCO Bank Realistic Transaction Generator
 * 
 * Based on modern UCO Bank statement patterns:
 * - Reference Format: UCOR{12-digits} (e.g., UCOR341756289043)
 * - UPI Format: UPI/{ref}/From:{sender}@{handle}/To:{recipient}@{handle}/{app}
 * - Modern transaction mix: ~85% UPI, ~8% IMPS/NEFT, ~7% ATM/Cash/Others
 * - UPI handles commonly used: @ybl, @paytm, @okaxis, @okicici, @ibl, @upi
 * - Recipient types: Merchants (Q-codes, Paytm QR), Person-to-Person, Business VPAs
 */

// UCO Bank reference number format: UCOR + 12 digits
export const generateUcoReference = (date: Date, rng: () => number): string => {
  const digits = Math.floor(rng() * 900000000000 + 100000000000);
  return `UCOR${digits}`;
};

// Common UPI handles for UCO Bank transactions
const UPI_HANDLES = [
  '@ybl',      // PhonePe/YES Bank (most common)
  '@paytm',    // Paytm
  '@okaxis',   // Axis Bank
  '@okicici',  // ICICI Bank
  '@ibl',      // IndusInd Bank
  '@upi',      // Generic UPI
  '@oksbi',    // SBI
  '@axisbank', // Axis
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
  const businessNames = [
    'flipkart', 'amazon', 'swiggy', 'zomato', 'uber', 'ola',
    'bigbasket', 'myntra', 'ajio', 'meesho', 'dunzo', 'zepto',
    'blinkit', 'dmart', 'reliance', 'jiomart', 'makemytrip', 'goibibo',
    'bookmyshow', 'paytmmall', 'snapdeal', 'shopclues', 'firstcry',
    'pepperfry', 'urbancompany', 'housejoy', 'justdial', 'magicbricks'
  ];
  
  const localBusinesses = [
    'maheshwripetroleum', 'rajenterprises', 'shivtraders', 'ramstores',
    'laxmigenstore', 'sainathkirana', 'ganeshmedical', 'hanumansweets',
    'krishnaelectronics', 'durgatextiles', 'saraswatibooks', 'kaligarments'
  ];
  
  const isLocal = rng() < 0.4;
  const businessList = isLocal ? localBusinesses : businessNames;
  const business = businessList[Math.floor(rng() * businessList.length)];
  
  if (isLocal) {
    // Local business with numbers
    const numbers = Math.floor(rng() * 90000000 + 10000000);
    const handles = ['@hdfcbank', '@okicici', '@okaxis'];
    const handle = handles[Math.floor(rng() * handles.length)];
    return `${business}.${numbers}${handle}`;
  } else {
    // Online business with subdomain
    const handles = ['@paytm', '@ybl', '@axisbank'];
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
  { name: 'PhonePe', weight: 0.45 },
  { name: 'Google Pay', weight: 0.30 },
  { name: 'Paytm', weight: 0.15 },
  { name: 'BHIM', weight: 0.05 },
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
const generateUcoUpiDebit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const from = generatePersonVPA(rng);
  
  // Recipient distribution for debit (payments made)
  const recipientType = rng();
  let to: string;
  
  if (recipientType < 0.35) {
    // 35% Q-code merchants (retail, grocery, petrol)
    to = generateQCodeVPA(rng);
  } else if (recipientType < 0.55) {
    // 20% Paytm QR
    to = generatePaytmQR(rng);
  } else if (recipientType < 0.75) {
    // 20% Business VPAs (online shopping, food delivery)
    to = generateBusinessVPA(rng);
  } else if (recipientType < 0.90) {
    // 15% Person to person
    to = generatePersonVPA(rng);
  } else {
    // 10% Vyapar (bill payments)
    to = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/Payment from ${app}`;
};

// Generate realistic UPI credit transaction
const generateUcoUpiCredit = (rng: () => number): string => {
  const ref = Math.floor(rng() * 900000000000 + 100000000000); // 12 digits
  const to = generatePersonVPA(rng); // Your VPA
  
  // Sender distribution for credit (money received)
  const senderType = rng();
  let from: string;
  
  if (senderType < 0.75) {
    // 75% Person to person (friends, family)
    from = generatePersonVPA(rng);
  } else if (senderType < 0.90) {
    // 15% Business (refunds, payments)
    from = generateBusinessVPA(rng);
  } else {
    // 10% Vyapar (business income)
    from = generateVyaparVPA(rng);
  }
  
  const app = getUpiApp(rng);
  return `UPI/${ref}/From:${from}/To:${to}/Payment from ${app}`;
};

// Generate other transaction types
const OTHER_DEBIT_TYPES = [
  { type: 'ATM', weight: 0.35, generator: (rng: () => number) => {
    const location = ['ATM-', 'UCO ATM-'][Math.floor(rng() * 2)];
    const atmId = Math.floor(rng() * 900000 + 100000);
    return `${location}${atmId}/WDL`;
  }},
  { type: 'IMPS', weight: 0.25, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    const beneficiary = ['TO BENEFICIARY', 'TRANSFER TO A/C'][Math.floor(rng() * 2)];
    return `IMPS/${ref}/${beneficiary}`;
  }},
  { type: 'NEFT', weight: 0.20, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 9000000000 + 1000000000);
    return `NEFT CR-N${ref}-CUSTOMER TRANSFER`;
  }},
  { type: 'CHARGES', weight: 0.10, generator: () => {
    const charges = ['SMS CHARGES', 'DEBIT CARD AMC', 'ACCOUNT MAINT CHARGES', 'CHEQUE BOOK CHARGES'];
    return charges[Math.floor(Math.random() * charges.length)];
  }},
  { type: 'POS', weight: 0.10, generator: (rng: () => number) => {
    const merchants = ['BIG BAZAAR', 'DMART', 'RELIANCE', 'MORE', 'SPENCERS', 'VISHAL MEGA'];
    const merchant = merchants[Math.floor(rng() * merchants.length)];
    return `POS ${merchant}/CARD`;
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
  { type: 'NEFT', weight: 0.50, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 9000000000 + 1000000000);
    return `NEFT CR-N${ref}-FROM CUSTOMER`;
  }},
  { type: 'IMPS', weight: 0.30, generator: (rng: () => number) => {
    const ref = Math.floor(rng() * 900000000000 + 100000000000);
    return `IMPS/${ref}/FROM REMITTER`;
  }},
  { type: 'CASH', weight: 0.15, generator: () => 'CASH DEPOSIT' },
  { type: 'INTEREST', weight: 0.05, generator: () => 'INT CREDITED' },
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

// Main transaction generator
export const generateUcoRealisticTransaction = (
  type: 'debit' | 'credit',
  date: Date,
  rng: () => number
): { description: string; reference: string } => {
  const isUpi = rng() < (type === 'debit' ? 0.85 : 0.80); // 85% debit, 80% credit are UPI
  
  if (isUpi) {
    const description = type === 'debit' 
      ? generateUcoUpiDebit(rng)
      : generateUcoUpiCredit(rng);
    return {
      description,
      reference: generateUcoReference(date, rng),
    };
  } else {
    const description = type === 'debit'
      ? generateOtherDebit(rng)
      : generateOtherCredit(rng);
    return {
      description,
      reference: generateUcoReference(date, rng),
    };
  }
};

