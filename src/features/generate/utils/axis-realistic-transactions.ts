import { randomInt, randomFloat } from '@/utils/random';

// Axis Bank UPI transaction generator
export function generateAxisUpiTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const upiApps = [
    'paytm', 'phonepe', 'googlepay', 'amazonpay', 'bhim', 'whatsapp',
  ];

  const merchants = [
    'Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'BigBasket', 'Grofers',
    'BookMyShow', 'Uber', 'Ola', 'MakeMyTrip', 'Airtel', 'JioMart',
  ];

  const app = upiApps[randomInt(0, upiApps.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  if (isDebit) {
    const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
    return `UPI-${merchant}-${app}@axisbank-${refNumber}`;
  } else {
    return `UPI-CREDIT-${app}@axisbank-${refNumber}`;
  }
}

// Axis Bank IMPS transaction generator
export function generateAxisImpsTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const accountRef = randomInt(10000000, 99999999, rng);
  
  if (isDebit) {
    return `IMPS-DR-AXISBK${refNumber}-${accountRef}`;
  } else {
    return `IMPS-CR-AXISBK${refNumber}-${accountRef}`;
  }
}

// Axis Bank NEFT transaction generator
export function generateAxisNeftTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const banks = ['HDFC', 'ICIC', 'SBIN', 'UTIB', 'IDFB', 'KKBK'];
  const bank = banks[randomInt(0, banks.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const utrNumber = `AXIS${randomInt(10000000, 99999999, rng)}`;
  
  if (isDebit) {
    return `NEFT-DR-${bank}${refNumber}-${utrNumber}`;
  } else {
    return `NEFT-CR-${bank}${refNumber}-${utrNumber}`;
  }
}

// Axis Bank RTGS transaction generator
export function generateAxisRtgsTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const utrNumber = `AXISR${randomInt(1000000000, 9999999999, rng)}`;
  
  if (isDebit) {
    return `RTGS-DR-${utrNumber}-${refNumber}`;
  } else {
    return `RTGS-CR-${utrNumber}-${refNumber}`;
  }
}

// Axis Bank ATM withdrawal - realistic multi-line format like SBI
export function generateAxisAtmWithdrawal(rng: () => number = Math.random): string {
  // Realistic Axis Bank ATM locations with detailed addresses
  const atmLocations = [
    { area: 'AAWAS NAGAR AB ROAD', city: 'DEDEWAS' },
    { area: 'MG ROAD VIJAY NAGAR', city: 'INDORE' },
    { area: 'PALASIA SQUARE', city: 'INDORE' },
    { area: 'SARAFA BAZAR MAIN', city: 'INDORE' },
    { area: 'BHANWAR KUWA ROAD', city: 'INDORE' },
    { area: 'REGAL SQUARE INDORE', city: 'INDORE' },
    { area: 'TREASURE ISLAND MALL', city: 'INDORE' },
    { area: 'SAPNA SANGEETA ROAD', city: 'INDORE' },
    { area: 'NEW PALASIA', city: 'INDORE' },
    { area: 'SOUTH TUKOGANJ', city: 'INDORE' },
    { area: 'VIJAY NAGAR SQUARE', city: 'INDORE' },
    { area: 'RACE COURSE ROAD', city: 'INDORE' },
    { area: 'CENTRAL MALL GEETA BHAWAN', city: 'INDORE' },
    { area: 'BOMBAY HOSPITAL ROAD', city: 'INDORE' },
    { area: 'RAJENDRA NAGAR MAIN', city: 'INDORE' }
  ];
  
  const location = atmLocations[randomInt(0, atmLocations.length - 1, rng)];
  
  // Sequential cash IDs in realistic Axis range (1100-1160)
  const cashId = randomInt(1100, 1160, rng);
  
  // Format: ATM WDL-ATM CASH [ID]\n[AREA]\n[CITY]
  return `ATM WDL-ATM CASH ${cashId}\n${location.area}\n${location.city}`;
}

// Axis Bank POS transaction
export function generateAxisPosTransaction(rng: () => number = Math.random): string {
  const merchants = [
    'MORE SUPERMARKET',
    'RELIANCE FRESH',
    'BIG BAZAAR',
    'DMart',
    'LIFESTYLE',
    'WESTSIDE',
    'PANTALOONS',
    'SHOPPER STOP',
    'CENTRAL',
    'MAX FASHION',
  ];
  
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const cardNum = `****${randomInt(1000, 9999, rng)}`;
  
  return `POS-${merchant}-${cardNum}-${refNumber}`;
}

// Axis Bank debit card charges
export function generateAxisDebitCardCharges(rng: () => number = Math.random): string {
  const charges = [
    'DEBIT CARD ANNUAL FEE',
    'DEBIT CARD AMC',
    'ATM MAINTENANCE CHARGES',
    'SMS ALERT CHARGES',
    'MINIMUM BALANCE CHARGES',
  ];
  
  return charges[randomInt(0, charges.length - 1, rng)];
}

// Axis Bank salary credit
export function generateAxisSalaryCredit(employer: string, rng: () => number = Math.random): string {
  const refNumber = randomInt(1000000000, 9999999999, rng);
  return `SAL-CR-${employer.toUpperCase().substring(0, 15)}-NEFT-${refNumber}`;
}

// Axis Bank interest credit
export function generateAxisInterestCredit(rng: () => number = Math.random): string {
  const types = [
    'SAVINGS ACCOUNT INTEREST CREDIT',
    'QUARTERLY INTEREST CREDIT',
    'HALF YEARLY INTEREST CREDIT',
  ];
  
  return types[randomInt(0, types.length - 1, rng)];
}

// Axis Bank EMI debit
export function generateAxisEmiDebit(rng: () => number = Math.random): string {
  const loanTypes = ['HOME', 'CAR', 'PERSONAL', 'EDUCATION'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const loanAccount = randomInt(10000000000, 99999999999, rng);
  
  return `EMI-${loanType} LOAN-${loanAccount}`;
}

// Axis Bank cheque deposit
export function generateAxisChequeDeposit(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  return `CHQ DEP-${chequeNum}-CLR`;
}

// Axis Bank cheque payment
export function generateAxisChequePayment(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  return `CHQ PAID-${chequeNum}`;
}

// Axis Bank standing instruction
export function generateAxisStandingInstruction(rng: () => number = Math.random): string {
  const types = [
    'SI-MUTUAL FUND SIP',
    'SI-INSURANCE PREMIUM',
    'SI-LOAN EMI',
    'SI-CREDIT CARD PAYMENT',
  ];
  
  const type = types[randomInt(0, types.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `${type}-${refNumber}`;
}

// Axis Bank bill payment
export function generateAxisBillPayment(rng: () => number = Math.random): string {
  const bills = [
    { type: 'ELECTRICITY', provider: 'MSEB' },
    { type: 'MOBILE', provider: 'AIRTEL' },
    { type: 'DTH', provider: 'TATA SKY' },
    { type: 'GAS', provider: 'MAHANAGAR GAS' },
    { type: 'WATER', provider: 'BMC' },
  ];
  
  const bill = bills[randomInt(0, bills.length - 1, rng)];
  const refNumber = randomInt(10000000000, 99999999999, rng);
  
  return `BBPS-${bill.type}-${bill.provider}-${refNumber}`;
}

// Axis Bank cash deposit
export function generateAxisCashDeposit(rng: () => number = Math.random): string {
  const branchCode = randomInt(1000, 9999, rng);
  const refNumber = randomInt(100000000, 999999999, rng);
  
  return `CASH DEP-BR${branchCode}-${refNumber}`;
}

// Axis Bank cash withdrawal
export function generateAxisCashWithdrawal(rng: () => number = Math.random): string {
  const branchCode = randomInt(1000, 9999, rng);
  const refNumber = randomInt(100000000, 999999999, rng);
  
  return `CASH WDL-BR${branchCode}-${refNumber}`;
}

// Axis Bank mobile/internet banking transfer
export function generateAxisOnlineTransfer(isDebit: boolean = true, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  if (isDebit) {
    return `NETBANKING-DR-AXISBK-${refNumber}`;
  } else {
    return `NETBANKING-CR-AXISBK-${refNumber}`;
  }
}

// Axis Bank autopay debit
export function generateAxisAutopayDebit(rng: () => number = Math.random): string {
  const merchants = [
    'NETFLIX', 'AMAZON PRIME', 'HOTSTAR', 'SPOTIFY', 'YOUTUBE PREMIUM',
    'GOOGLE ONE', 'APPLE MUSIC', 'ZOOM', 'OFFICE 365',
  ];
  
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `AUTOPAY-${merchant}-${refNumber}`;
}

// Main realistic transaction generator
export function generateAxisRealisticTransaction(
  type: 'debit' | 'credit' = 'debit',
  specificType?: string,
  rng: () => number = Math.random
): string {
  if (specificType === 'salary') {
    return generateAxisSalaryCredit('ABC COMPANY PVT LTD', rng);
  }

  if (type === 'credit') {
    const creditTypes = [
      () => generateAxisUpiTransaction(false, rng),
      () => generateAxisNeftTransaction(false, rng),
      () => generateAxisRtgsTransaction(false, rng),
      () => generateAxisImpsTransaction(false, rng),
      () => generateAxisInterestCredit(rng),
      () => generateAxisChequeDeposit(rng),
      () => generateAxisCashDeposit(rng),
      () => generateAxisOnlineTransfer(false, rng),
    ];
    return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
  }

  // Debit transactions
  const debitTypes = [
    () => generateAxisUpiTransaction(true, rng),
    () => generateAxisNeftTransaction(true, rng),
    () => generateAxisRtgsTransaction(true, rng),
    () => generateAxisImpsTransaction(true, rng),
    () => generateAxisAtmWithdrawal(rng),
    () => generateAxisPosTransaction(rng),
    () => generateAxisEmiDebit(rng),
    () => generateAxisChequePayment(rng),
    () => generateAxisStandingInstruction(rng),
    () => generateAxisBillPayment(rng),
    () => generateAxisCashWithdrawal(rng),
    () => generateAxisOnlineTransfer(true, rng),
    () => generateAxisAutopayDebit(rng),
  ];

  return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
}
