import { randomInt, randomFloat } from '@/utils/random';

//Real Indian names for UPI transactions - EXPANDED pool to prevent circular patterns
//Each transaction should use a unique name to avoid repeated transfers flagged by NBFC systems
const INDIAN_NAMES = [
  'Ghanshya', 'Vipin P', 'Soniya P', 'Nitin C', 'Akhlesh', 'Ramesh K',
  'Manoj S', 'Ravi Ku', 'Kiran J', 'Sunder D', 'Mohd Sho', 'Amir Uddin',
  'Vinod T', 'Rajesh K', 'Priya S', 'Dinesh M', 'Anjali R', 'Vikram S',
  'Deepak G', 'Anita R', 'Rahul M', 'Meera K', 'Vishal T', 'Kavita M',
  'Arun Pa', 'Seema D', 'Harish B', 'Rekha G', 'Mukesh Y', 'Sunita V',
  'Prakash', 'Nisha T', 'Ashok Ku', 'Preeti S', 'Sandeep', 'Geeta Ra',
  'Rajeev M', 'Divya N', 'Manish G', 'Poornima', 'Anil Ku', 'Swati Pa',
  'Yogesh K', 'Neelam S', 'Sanjay R', 'Uma Devi', 'Rohit Si', 'Lata Ma',
  'Sunil Ku', 'Archana', 'Naveen P', 'Rani Kum', 'Praveen', 'Shanti D',
  'Mahesh T', 'Lakshmi', 'Ramesh P', 'Jyoti Si', 'Girish K', 'Vanita R',
  'Santosh', 'Bharti M', 'Naresh K', 'Pushpa D', 'Raju Kum', 'Sarita P',
  'Ajay Sin', 'Mamta Ra', 'Vijay Ku', 'Usha Ran', 'Sudhir P', 'Anuja Pa',
  'Mohan La', 'Veena Ku', 'Kishore', 'Savita D', 'Hemant K', 'Shobha M',
  'Jagdish', 'Pramila', 'Subhash', 'Nirmala', 'Brijesh', 'Kamala D',
  'Avinash', 'Sudha Pa', 'Ramanuj', 'Manjula', 'Dilip Ku', 'Padmini',
  'Umesh Pa', 'Sharada', 'Prakrti', 'Madhuri', 'Nitesh M', 'Sharmila'
];

// Track used names in current statement to prevent circular patterns
let usedNamesInStatement: Set<string> = new Set();

// Reset used names at the start of each statement
export const resetUsedNames = () => {
  usedNamesInStatement.clear();
};

// Get a unique name that hasn't been used yet
const getUniqueName = (rng: () => number): string => {
  const availableNames = INDIAN_NAMES.filter(name => !usedNamesInStatement.has(name));
  
  // If all names used, clear and start over (rare case)
  if (availableNames.length === 0) {
    usedNamesInStatement.clear();
    return INDIAN_NAMES[randomInt(0, INDIAN_NAMES.length - 1, rng)];
  }
  
  const selectedName = availableNames[randomInt(0, availableNames.length - 1, rng)];
  usedNamesInStatement.add(selectedName);
  return selectedName;
};

//Bank codes used in India
const BANK_CODES = [
  'SBIN', 'HDFC', 'ICIC', 'YESB', 'KKBK', 'AIRP', 'UTIB', 'IDFB', 
  'BKID', 'IDIB', 'PUNB', 'CNRB', 'CBIN', 'INDB', 'UBIN', 'BARB'
];

//UPI IDs and handles
const UPI_HANDLES = [
  'paytm', 'gpay', 'phonepe', 'amazonpay', 'bhim'
];

//Common location suffixes for any city (will be used with user's city)
const LOCATION_SUFFIXES = [
  'Main Branch', 'ATM', 'Sector', 'Road', 'Market', 'Plaza',
  'Mall', 'Complex', 'Junction', 'Station', 'Circle', 'Chowk'
];

//Area names that can be combined with city
const AREA_PREFIXES = [
  'Central', 'East', 'West', 'North', 'South', 'New', 'Old'
];

//Merchant names for POS transactions
const MERCHANTS = [
  'CANTERBURY TRADERS LLP', 'YOUR SERVICE STATION', 'RELIANCE DIGITAL',
  'DMart SUPER MARKET', 'BIG BAZAAR', 'CAFE COFFEE DAY', 'McDONALDS',
  'PETROL PUMP HP', 'DOMINOS PIZZA', 'SHOPPERS STOP', 'PANTALOONS'
];

//Store user's city and branch location for the entire statement
let userCity: string = 'BHOPAL'; // Default
let userBranchLocation: string = 'Main Branch'; // Default

//Set user location from form data (call this at start of statement generation)
export const setSbiUserLocation = (city?: string, branchAddress?: string) => {
  //Use user's city or default to BHOPAL
  userCity = city?.toUpperCase().trim() || 'BHOPAL';
  
  //Extract location from branch address or use default
  if (branchAddress) {
    //Try to extract meaningful location from branch address
    const words = branchAddress.split(/[,\s]+/).filter(w => w.length > 2);
    userBranchLocation = words.slice(0, 3).join(' ').toUpperCase();
  } else {
    userBranchLocation = 'Main Branch';
  }
};

//Generate location within user's city
const getLocationInUserCity = (rng: () => number): string => {
  const usePrefix = rng() < 0.4;
  const suffix = LOCATION_SUFFIXES[randomInt(0, LOCATION_SUFFIXES.length - 1, rng)];
  
  if (usePrefix) {
    const prefix = AREA_PREFIXES[randomInt(0, AREA_PREFIXES.length - 1, rng)];
    return `${prefix} ${userCity} ${suffix}`;
  }
  
  //Sometimes use branch location
  if (rng() < 0.3) {
    return userBranchLocation;
  }
  
  return `${userCity} ${suffix}`;
};

//Generate realistic UPI transaction with varying formats (1, 2, or 3 lines)
export const generateUpiTransaction = (
  isCredit: boolean,
  rng: () => number
): { description: string; reference: string } => {
  // UPI Reference: 12 digits (realistic SBI format)
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  const name = getUniqueName(rng); // Use unique name to prevent circular patterns
  const bankCode = BANK_CODES[randomInt(0, BANK_CODES.length - 1, rng)];
  const mobile = `${randomInt(7, 9, rng)}${randomInt(100000000, 999999999, rng)}`;
  const upiHandle = UPI_HANDLES[randomInt(0, UPI_HANDLES.length - 1, rng)];
  
  const direction = isCredit ? 'CR' : 'DR';
  const action = isCredit ? 'BY TRANSFER' : 'TO TRANSFER';
  const flow = isCredit ? 'FROM' : 'TO';
  
  // Generate UPI ID variations - use "Payme-" format for paytm
  const upiIdFormats = [
    `${mobile}`,
    `${upiHandle === 'paytm' ? 'Payme-' : upiHandle}rechar`,
    `${upiHandle}.${randomInt(1000, 9999, rng)}`,
    `${name.toLowerCase().replace(/\s+/g, '')}@`,
    `q${randomInt(100000000, 999999999, rng)}`
  ];
  const upiId = upiIdFormats[randomInt(0, upiIdFormats.length - 1, rng)];
  
  // Vary UPI format: 1-line (30%), 2-line (40%), or 3-line (30%)
  const formatType = rng();
  let description: string;
  
  if (formatType < 0.3) {
    // 1-line format (compact)
    description = `${action}-UPI/${direction}/${refNumber}/${name.substring(0, Math.min(name.length, 10)).padEnd(8, ' ')}/${bankCode}/${upiId}/UPI`;
  } else if (formatType < 0.7) {
    // 2-line format (common)
    description = `${action}-\nUPI/${direction}/${refNumber}/${name.substring(0, Math.min(name.length, 10)).padEnd(8, ' ')}/${bankCode}/${upiId}/UPI`;
  } else {
    // 3-line format (detailed)
    description = `${action}-\nUPI/${direction}/${refNumber}/${name
      .substring(0, Math.min(name.length, 10))
      .padEnd(8, ' ')}/${bankCode}/\n${upiId}/UPI`;
  }
  
  // Reference: 13 digits starting with 469 or 489 (realistic SBI format)
  const refPrefix = rng() < 0.5 ? '469' : '489';
  const refSuffix = randomInt(1000000000, 9999999999, rng);
  const reference = `TRANSFER\n${flow}\n ${refPrefix}${refSuffix}`;
  
  return { description, reference };
};

// Generate NEFT transaction
export const generateNeftTransaction = (
  isCredit: boolean,
  rng: () => number
): { description: string; reference: string } => {
  const bankCode = BANK_CODES[randomInt(0, BANK_CODES.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const year = new Date().getFullYear().toString().substring(2);
  
  const entities = [
    'COMMISSIONER MUN', 'TAX DEPARTMENT', 'UTILITY SERVICES',
    'INSURANCE CORP', 'LOAN SERVICES', 'FINANCE LTD'
  ];
  const entity = entities[randomInt(0, entities.length - 1, rng)];
  
  const action = isCredit ? 'BY TRANSFER' : 'TO TRANSFER';
  const flow = isCredit ? 'FROM' : 'TO';
  
  const description = `${action}-\nNEFT*${bankCode}0000${randomInt(100, 999, rng)}*${bankCode}${year
    }\n${refNumber}*${entity}`;
  
  const reference = `TRANSFER\n${flow}\n 995${randomInt(10000000, 99999999, rng)}`;
  
  return { description, reference };
};

// Generate ATM withdrawal - always in user's city with realistic multi-line format
export const generateAtmWithdrawal = (
  rng: () => number
): { description: string; reference: string } => {
  // Realistic SBI ATM locations with street names
  const atmLocations = [
    { area: 'AAWAS NAGAR AB ROAD', city: 'DEDEWAS' },
    { area: 'MG ROAD VIJAY NAGAR', city: 'INDORE' },
    { area: 'PALASIA SQUARE', city: 'INDORE' },
    { area: 'SARAFA BAZAR MAIN', city: 'INDORE' },
    { area: 'BHANWAR KUWA ROAD', city: 'INDORE' },
    { area: 'REGAL SQUARE', city: 'INDORE' },
    { area: 'TREASURE ISLAND MALL', city: 'INDORE' },
    { area: 'SAPNA SANGEETA ROAD', city: 'INDORE' },
    { area: 'NEW PALASIA', city: 'INDORE' },
    { area: 'SOUTH TUKOGANJ', city: 'INDORE' },
    { area: 'RAJENDRA NAGAR', city: 'INDORE' },
    { area: 'VIJAY NAGAR SQUARE', city: 'INDORE' },
    { area: 'RACE COURSE ROAD', city: 'INDORE' },
    { area: 'CENTRAL MALL GEETA BHAWAN', city: 'INDORE' },
    { area: 'BOMBAY HOSPITAL ROAD', city: 'INDORE' }
  ];
  
  const location = atmLocations[randomInt(0, atmLocations.length - 1, rng)];
  
  // Sequential cash IDs starting from 1120-1150 range (realistic SBI range)
  const cashIdBase = randomInt(1120, 1150, rng);
  
  // Format: ATM WDL-ATM CASH [ID]\n[AREA]\n[CITY]
  const description = `ATM WDL-ATM CASH ${cashIdBase}\n${location.area}\n${location.city}`;
  
  return { description, reference: '' };
};

// Generate POS/Debit card transaction - always in user's city
export const generatePosTransaction = (
  rng: () => number
): { description: string; reference: string } => {
  const merchant = MERCHANTS[randomInt(0, MERCHANTS.length - 1, rng)];
  const refNumber = randomInt(1000000000000, 9999999999999, rng);
  
  const formats = [
    `by debit card\nSBIPOS${String(refNumber).substring(0, 12)}${merchant}\n ${userCity}`,
    `by debit card\nOTHPOS${refNumber}${merchant}  ${userCity}`
  ];
  
  const description = formats[randomInt(0, formats.length - 1, rng)];
  
  return { description, reference: '' };
};

// Reset function is no longer needed - we use setSbiUserLocation instead
export const resetSbiLocationTracking = () => {
  // Kept for backward compatibility but does nothing
  // Use setSbiUserLocation instead
};

// Generate cash deposit
export const generateCashDeposit = (
  rng: () => number
): { description: string; reference: string } => {
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const cdmId = randomInt(1000, 9999, rng);
  
  const description = `CSH DEP (CDM)-${refNumber}\n ${cdmId}`;
  
  return { description, reference: '' };
};

// Generate mandate debit (loan EMI, insurance, etc.)
export const generateMandateDebit = (
  rng: () => number
): { description: string; reference: string } => {
  const companies = [
    'Bajaj Finance Ltd', 'HDFC Life Insurance', 'ICICI Prudential',
    'SBI Cards', 'Kotak Mahindra', 'Axis Finance'
  ];
  const company = companies[randomInt(0, companies.length - 1, rng)];
  
  const description = `DEBIT-CMP MANDATE DEBIT\n ${company} - SI`;
  
  return { description, reference: '' };
};

// Generate service charge
export const generateServiceCharge = (
  rng: () => number
): { description: string; reference: string } => {
  const refNumber = randomInt(10000000, 99999999, rng);
  
  const charges = [
    'FI SERVICE CHARGE DR-',
    'SMS ALERT CHARGES-',
    'AMC CHARGES-',
    'DEBIT CARD AMC-'
  ];
  const charge = charges[randomInt(0, charges.length - 1, rng)];
  
  const description = `${charge}\n${refNumber}`;
  const reference = `${refNumber}`;
  
  return { description, reference };
};

// Generate Google/Paytm cashback
export const generateCashback = (
  rng: () => number
): { description: string; reference: string } => {
  // UPI Reference: 12 digits
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  const providers = [
    { name: 'GOOGLE I', upi: 'goog-Payme-', bank: 'UTIB' },
    { name: 'PAYTM', upi: 'Payme-.s1cd', bank: 'YESB' },
    { name: 'PHONEPE', upi: 'phonepe.1', bank: 'ICIC' }
  ];
  const provider = providers[randomInt(0, providers.length - 1, rng)];
  
  const description = `BY TRANSFER-\nUPI/CR/${refNumber}/${provider.name
    .padEnd(8, ' ')}/${provider.bank}/${provider.upi}/UPI`;
  
  // Reference: 13 digits starting with 469 or 489
  const refPrefix = rng() < 0.5 ? '469' : '489';
  const refSuffix = randomInt(1000000000, 9999999999, rng);
  const reference = `TRANSFER\nFROM\n ${refPrefix}${refSuffix}`;
  
  return { description, reference };
};

// Main function to generate a random realistic transaction
export const generateRealisticSbiTransaction = (
  type: 'credit' | 'debit',
  rng: () => number
): { description: string; reference: string; amount: number } => {
  let txnData: { description: string; reference: string };
  let amount: number;
  
  if (type === 'credit') {
    const creditTypes = [
      { weight: 60, fn: () => generateUpiTransaction(true, rng) }, // Increased UPI
      { weight: 30, fn: () => generateNeftTransaction(true, rng) }, // Increased NEFT/IMPS
      { weight: 3, fn: () => generateCashDeposit(rng) }, // Drastically reduced cash
      { weight: 7, fn: () => generateCashback(rng) }
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
    
    // Credit amounts vary based on type - REALISTIC amounts with mostly round figures
    if (txnData.description.includes('NEFT')) {
      // NEFT: Occasional larger transfers - 98% round figures
      const neftType = rng();
      const useRound = rng() < 0.98; // 98% round figures
      if (neftType < 0.7) {
        amount = useRound ? randomInt(2, 8, rng) * 1000 : randomFloat(2000, 8000, 2, rng);
      } else if (neftType < 0.9) {
        amount = useRound ? randomInt(8, 15, rng) * 1000 : randomFloat(8000, 15000, 2, rng);
      } else {
        amount = useRound ? randomInt(15, 25, rng) * 1000 : randomFloat(15000, 25000, 2, rng);
      }
    } else if (txnData.description.includes('CSH DEP')) {
      // Cash deposits: 100% round figures (always round)
      const depositType = rng();
      if (depositType < 0.6) {
        amount = randomInt(5, 15, rng) * 1000; // 5000, 10000, 15000
      } else if (depositType < 0.85) {
        amount = randomInt(15, 30, rng) * 1000; // 15000, 20000, 25000, 30000
      } else {
        amount = randomInt(30, 50, rng) * 1000; // 30000, 40000, 50000
      }
    } else if (txnData.description.includes('GOOGLE') || txnData.description.includes('PAYTM')) {
      // Cashback: Keep small as it's legitimate rewards
      amount = randomFloat(5, 500, 2, rng);
    } else {
      // UPI credits: 98% round figures
      const upiType = rng();
      const useRound = rng() < 0.98; // 98% round figures
      if (upiType < 0.5) {
        amount = useRound ? randomInt(1, 3, rng) * 1000 : randomFloat(1000, 3000, 2, rng);
      } else if (upiType < 0.8) {
        amount = useRound ? randomInt(3, 6, rng) * 1000 : randomFloat(3000, 6000, 2, rng);
      } else {
        amount = useRound ? randomInt(6, 12, rng) * 1000 : randomFloat(6000, 12000, 2, rng);
      }
    }
  } else {
    const debitTypes = [
      { weight: 65, fn: () => generateUpiTransaction(false, rng) }, // Increased UPI payments
      { weight: 2, fn: () => generateAtmWithdrawal(rng) }, // Drastically reduced ATM cash
      { weight: 20, fn: () => generatePosTransaction(rng) }, // Card payments (digital)
      { weight: 10, fn: () => generateMandateDebit(rng) }, // Auto-debits
      { weight: 3, fn: () => generateServiceCharge(rng) }
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
    
    // Debit amounts vary based on type - 98-100% round figures
    if (txnData.description.includes('ATM WDL')) {
      // ATM: 100% round figures (always round)
      const atmType = rng();
      if (atmType < 0.5) {
        const smallAmounts = [500, 1000, 1500, 2000];
        amount = smallAmounts[randomInt(0, smallAmounts.length - 1, rng)];
      } else if (atmType < 0.85) {
        const mediumAmounts = [2500, 3000, 4000, 5000];
        amount = mediumAmounts[randomInt(0, mediumAmounts.length - 1, rng)];
      } else {
        const largeAmounts = [7000, 8000, 10000];
        amount = largeAmounts[randomInt(0, largeAmounts.length - 1, rng)];
      }
    } else if (txnData.description.includes('SERVICE CHARGE') || txnData.description.includes('AMC')) {
      // Service charges: Keep realistic (not always round)
      amount = randomFloat(10, 200, 2, rng);
    } else if (txnData.description.includes('MANDATE DEBIT')) {
      // EMI/Mandate: 98% round figures
      const useRound = rng() < 0.98;
      amount = useRound ? randomInt(2, 5, rng) * 1000 : randomFloat(1500, 4500, 2, rng);
    } else if (txnData.description.includes('SBIPOS') || txnData.description.includes('OTHPOS')) {
      // POS: Shopping amounts - 98% round figures
      const posType = rng();
      const useRound = rng() < 0.98; // 98% round
      if (posType < 0.6) {
        amount = useRound ? [500, 1000, 1500, 2000, 2500][randomInt(0, 4, rng)] : randomFloat(500, 2500, 2, rng);
      } else if (posType < 0.85) {
        amount = useRound ? randomInt(3, 5, rng) * 1000 : randomFloat(2500, 5000, 2, rng);
      } else {
        amount = useRound ? randomInt(5, 9, rng) * 1000 : randomFloat(5000, 9000, 2, rng);
      }
    } else {
      // UPI debits: Everyday expenses - 98% round figures
      const upiType = rng();
      const useRound = rng() < 0.98; // 98% round figures
      if (upiType < 0.5) {
        amount = useRound ? [300, 500, 1000, 1500][randomInt(0, 3, rng)] : randomFloat(300, 1500, 2, rng);
      } else if (upiType < 0.8) {
        amount = useRound ? randomInt(2, 4, rng) * 1000 : randomFloat(1500, 4000, 2, rng);
      } else {
        amount = useRound ? randomInt(4, 8, rng) * 1000 : randomFloat(4000, 8000, 2, rng);
      }
    }
  }
  
  return { ...txnData, amount };
};
