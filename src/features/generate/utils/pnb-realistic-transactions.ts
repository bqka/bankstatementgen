import { randomInt, randomFloat } from '@/utils/random';

// PNB UPI transaction generator
export function generatePnbUpiTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const upiIds = [
    'paytm@paytm',
    'yesbank@ybl',
    'icici@icici',
    'okaxis@okaxis',
    'okhdfcbank@hdfcbank',
    'oksbi@sbi',
    'okicici@icici',
    'axisbank@axl',
    'idfcbank@idfcbank',
    'boi@boi',
  ];

  const merchants = [
    'GUMMI',
    'CUMMI',
    'BAJUBIN',
    'YESBIN',
    'BA/UBIN',
    'COMMUNICATI',
    'C VEST',
    'BA/UBIN',
  ];

  const refNumber = randomInt(100000000000, 999999999999, rng);
  const upiId = upiIds[randomInt(0, upiIds.length - 1, rng)];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  
  if (isDebit) {
    return `UPI/DR/${refNumber}/${merchant}\nBA/UBIN/${randomInt(700000000, 799999999, rng)}/${upiId}/p`;
  } else {
    return `UPI/DR/${refNumber}/${merchant}\nBA/UBIN/${randomInt(700000000, 799999999, rng)}/${upiId}`;
  }
}

// PNB NEFT transaction generator
export function generatePnbNeftTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const banks = [
    { name: 'YESBANK', code: 'YESB' },
    { name: 'HDFCBANK', code: 'HDFC' },
    { name: 'SBIBANK', code: 'SBIN' },
    { name: 'ICICIBANK', code: 'ICIC' },
    { name: 'AXISBANK', code: 'UTIB' },
    { name: 'IDFCFIRSTBANK', code: 'IDFB' },
  ];

  const bank = banks[randomInt(0, banks.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const accountRef = randomInt(100000000, 999999999, rng);

  if (isDebit) {
    return `NEFT_IN-${bank.code}${randomInt(10000000, 99999999, rng)}/${accountRef}/FROM PUNE 37\nCOMMUNICATIONS`;
  } else {
    return `NEFT_IN-00YESA${randomInt(10000000, 99999999, rng)}/${accountRef}/YESB0${randomInt(100000, 999999, rng)}/YESH M\nCOMMUNICATI`;
  }
}

// PNB IMPS transaction generator
export function generatePnbImpsTransaction(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const accountRef = randomInt(100000000, 999999999, rng);
  
  return `IMPS-INV${refNumber}/${accountRef}/${randomInt(100000, 999999, rng)}/YESH M`;
}

// PNB Cheque Book Charges
export function generatePnbChequeBookCharges(): string {
  return `CHEQUE BOOK CHARGES`;
}

// PNB service charges
export function generatePnbServiceCharges(rng: () => number = Math.random): string {
  const charges = [
    'DEBIT CARD AMC',
    'SMS ALERT CHARGES',
    'MINIMUM BALANCE CHARGES',
    'ACCOUNT MAINTENANCE CHARGES',
    'ONLINE TRANSACTION CHARGES',
  ];
  
  return charges[randomInt(0, charges.length - 1, rng)];
}

// PNB ATM withdrawal
export function generatePnbAtmWithdrawal(rng: () => number = Math.random): string {
  const locations = [
    'MUMBAI',
    'DELHI',
    'BANGALORE',
    'PUNE',
    'HYDERABAD',
    'CHENNAI',
    'KOLKATA',
    'AHMEDABAD',
    'BHOPAL',
    'INDORE',
  ];

  const location = locations[randomInt(0, locations.length - 1, rng)];
  const atmId = randomInt(100000, 999999, rng);
  const refNumber = randomInt(100000000000, 999999999999, rng);

  return `ATM WDL ${location} ${atmId}/${refNumber}`;
}

// PNB POS transaction
export function generatePnbPosTransaction(rng: () => number = Math.random): string {
  const merchants = [
    'BIG BAZAAR',
    'RELIANCE RETAIL',
    'DMart',
    'MORE SUPERMARKET',
    'EASY DAY',
    'VISHAL MEGA MART',
    'SPENCER\'S',
    'NILGIRIS',
    'FOODWORLD',
    'HYPERCITY',
  ];

  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const location = randomInt(100, 999, rng);

  return `POS ${merchant} ${location}/${refNumber}`;
}

// PNB salary credit
export function generatePnbSalaryCredit(employer: string): string {
  const refNumber = randomInt(100000000, 999999999, Math.random);
  return `SALARY CREDIT FROM ${employer.toUpperCase()}\nNEFT-${refNumber}`;
}

// PNB interest credit
export function generatePnbInterestCredit(): string {
  return `INT.CREDIT\nQUARTERLY INTEREST CREDIT`;
}

// PNB mobile/DTH recharge
export function generatePnbRecharge(type: 'MOBILE' | 'DTH' = 'MOBILE', rng: () => number = Math.random): string {
  const operators = {
    MOBILE: ['AIRTEL', 'JIO', 'VI', 'BSNL'],
    DTH: ['TATA SKY', 'DISH TV', 'AIRTEL DTH', 'SUN DIRECT'],
  };

  const operator = operators[type][randomInt(0, operators[type].length - 1, rng)];
  const refNumber = randomInt(10000000000, 99999999999, rng);

  return `${type} RECHARGE ${operator}\nUPI/DR/${refNumber}`;
}

// PNB electricity/water bill payment
export function generatePnbBillPayment(rng: () => number = Math.random): string {
  const bills = [
    { name: 'ELECTRICITY', provider: 'MSEDCL' },
    { name: 'ELECTRICITY', provider: 'BESCOM' },
    { name: 'WATER', provider: 'MUNICIPAL CORP' },
    { name: 'GAS', provider: 'MAHANAGAR GAS' },
  ];

  const bill = bills[randomInt(0, bills.length - 1, rng)];
  const refNumber = randomInt(10000000000, 99999999999, rng);

  return `${bill.name} BILL ${bill.provider}\nUPI/DR/${refNumber}`;
}

// PNB cash deposit
export function generatePnbCashDeposit(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000, 999999999, rng);
  return `CASH DEPOSIT\nCDM/${refNumber}`;
}

// PNB insurance premium
export function generatePnbInsurancePremium(rng: () => number = Math.random): string {
  const companies = [
    'LIC',
    'HDFC LIFE',
    'ICICI PRUDENTIAL',
    'SBI LIFE',
    'MAX LIFE',
    'BAJAJ ALLIANZ',
  ];

  const company = companies[randomInt(0, companies.length - 1, rng)];
  const policyNumber = randomInt(1000000000, 9999999999, rng);

  return `INSURANCE PREMIUM ${company}\nPOLICY/${policyNumber}`;
}

// PNB loan EMI
export function generatePnbLoanEmi(rng: () => number = Math.random): string {
  const loanTypes = ['HOME LOAN', 'CAR LOAN', 'PERSONAL LOAN', 'EDUCATION LOAN'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const accountNumber = randomInt(10000000000, 99999999999, rng);

  return `EMI ${loanType}\nA/C NO-${accountNumber}`;
}

// Main realistic transaction generator
export function generatePnbRealisticTransaction(
  type: 'debit' | 'credit' = 'debit',
  specificType?: string,
  rng: () => number = Math.random
): string {
  if (specificType === 'salary') {
    return generatePnbSalaryCredit('ABC COMPANY PVT LTD');
  }

  if (type === 'credit') {
    const creditTypes = [
      () => generatePnbUpiTransaction(false, rng),
      () => generatePnbNeftTransaction(false, rng),
      () => generatePnbInterestCredit(),
      () => generatePnbCashDeposit(rng),
      () => generatePnbImpsTransaction(rng),
    ];
    return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
  }

  // Debit transactions
  const debitTypes = [
    () => generatePnbUpiTransaction(true, rng),
    () => generatePnbNeftTransaction(true, rng),
    () => generatePnbAtmWithdrawal(rng),
    () => generatePnbPosTransaction(rng),
    () => generatePnbRecharge('MOBILE', rng),
    () => generatePnbRecharge('DTH', rng),
    () => generatePnbBillPayment(rng),
    () => generatePnbLoanEmi(rng),
    () => generatePnbInsurancePremium(rng),
  ];

  return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
}
