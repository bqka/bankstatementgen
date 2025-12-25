import { randomInt } from '@/utils/random';

// IOB (Indian Overseas Bank) transaction generators based on real statement patterns

const PERSON_NAMES = [
  'RUPESH PRAJAPA', 'LATA WO DHARME', 'MD SADIQUE ZEY', 'SATYAM MASANI',
  'Omprakash Vis', 'ABHISHEK MEHAR', 'AKASH', 'RAMASELVAM NAT',
  'SHAILENDRA VE', 'NEETESH MEHARA', 'Rakesh Kumar', 'Sona Bai',
  'BHUPENDRA BHUP', 'Kamal Singh', 'SHUBHAM SO NAR', 'Arun Prajapati',
  'ANIL BALMIK', 'Suraj Kumar', 'DEVENDRA BHILA', 'SHARMILA GURJ',
  'SALONI BHADE', 'KAJAL RATHORE', 'MOHAMMAD MUJA', 'VIVEK',
  'Om Kurmi', 'SALMAN ALI', 'Ms ANKITA KIRA', 'Lakhan Mehatar',
  'Bhuli Bai', 'Pawan Ahirwar', 'MEMON SUHAN MO'
];

const IOB_BANKS = [
  'YES', 'UCB', 'IBK', 'KKB', 'UBI', 'SBI', 'BAR', 'IND', 
  'AIR', 'UNB', 'UTI', 'IPO', 'PUN', 'IDI', 'HDC', 'AXI'
];

const UPI_SUFFIXES = [
  'Payment f', 'Sent usin', 'Paid via', 'Pay to Bh', 'Pay To Bh', 'UPI'
];

const RECHARGE_MERCHANTS = [
  'Jio Recharge', 'Vodafone Idea', 'Airtel Recharge', 'Vi Recharge', 'BSNL Recharge'
];

const BILL_MERCHANTS = [
  'Poorvika resta', 'Amazon Pay', 'Paytm', 'PhonePe', 'Google Pay'
];

// Generate IOB reference number (S followed by 8 digits)
export function generateIobReference(rng: () => number = Math.random): string {
  return `S${randomInt(10000000, 99999999, rng)}`;
}

// Generate UPI debit transaction
export function generateIobUpiDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  const bank = IOB_BANKS[randomInt(0, IOB_BANKS.length - 1, rng)];
  const suffix = UPI_SUFFIXES[randomInt(0, UPI_SUFFIXES.length - 1, rng)];
  
  return `UPI/${refNum}/DR/${name}/${bank}/${suffix}`;
}

// Generate UPI credit transaction
export function generateIobUpiCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  const bank = IOB_BANKS[randomInt(0, IOB_BANKS.length - 1, rng)];
  const suffix = UPI_SUFFIXES[randomInt(0, UPI_SUFFIXES.length - 1, rng)];
  
  return `UPI/${refNum}/CR/${name}/${bank}/${suffix}`;
}

// Generate recharge transaction
export function generateIobRecharge(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const merchant = RECHARGE_MERCHANTS[randomInt(0, RECHARGE_MERCHANTS.length - 1, rng)];
  const bank = 'YES';
  
  return `UPI/${refNum}/DR/ ${merchant}/${bank}/Payment f`;
}

// Generate bill payment
export function generateIobBillPayment(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const merchant = BILL_MERCHANTS[randomInt(0, BILL_MERCHANTS.length - 1, rng)];
  const bank = IOB_BANKS[randomInt(0, IOB_BANKS.length - 1, rng)];
  
  return `UPI/${refNum}/DR/${merchant}/${bank}/Payment f`;
}

// Generate IMPS debit transaction
export function generateIobImpsDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  
  return `IMPS/DR/${refNum}/${name}`;
}

// Generate IMPS credit transaction
export function generateIobImpsCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  
  return `IMPS/CR/${refNum}/${name}`;
}

// Generate NEFT debit transaction
export function generateIobNeftDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  
  return `NEFT/DR/${refNum}/${name}`;
}

// Generate NEFT credit transaction
export function generateIobNeftCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
  
  return `NEFT/CR/${refNum}/${name}`;
}

// Generate ACH debit transaction
export function generateIobAchDebit(rng: () => number = Math.random): string {
  const merchants = [
    'ARISTOSECURI', 'INSURANCE PREMIUM', 'SIP MUTUAL FUND', 'LOAN EMI',
    'CREDIT CARD BILL', 'UTILITY BILL', 'SUBSCRIPTION'
  ];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const accountNum = `IOBA${randomInt(1000000000000000, 9999999999999999, rng)}`;
  
  return `To: TP ACH ${merchant} - ${accountNum}`;
}

// Generate ACH credit transaction
export function generateIobAchCredit(rng: () => number = Math.random): string {
  const merchants = [
    'SALARY CREDIT', 'PENSION CREDIT', 'GOVT SUBSIDY', 'DIVIDEND CREDIT'
  ];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const accountNum = `IOBA${randomInt(1000000000000000, 9999999999999999, rng)}`;
  
  return `From: TP ACH ${merchant} - ${accountNum}`;
}

// Generate ATM withdrawal
export function generateIobAtmWithdrawal(rng: () => number = Math.random): string {
  const locations = ['MUMBAI', 'DELHI', 'BANGALORE', 'PUNE', 'HYDERABAD', 'CHENNAI'];
  const location = locations[randomInt(0, locations.length - 1, rng)];
  const atmId = randomInt(100000, 999999, rng);
  
  return `ATM WDL/${atmId}/${location}/IOB`;
}

// Generate cash deposit
export function generateIobCashDeposit(rng: () => number = Math.random): string {
  const branchCodes = ['3133', '3134', '3135', '3136', '3137'];
  const branch = branchCodes[randomInt(0, branchCodes.length - 1, rng)];
  
  return `CASH DEP/BRANCH/${branch}/IOB`;
}

// Generate cash withdrawal
export function generateIobCashWithdrawal(rng: () => number = Math.random): string {
  const branchCodes = ['3133', '3134', '3135', '3136', '3137'];
  const branch = branchCodes[randomInt(0, branchCodes.length - 1, rng)];
  
  return `CASH WDL/BRANCH/${branch}/IOB`;
}

// Generate salary credit
export function generateIobSalaryCredit(employerName: string, rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const employerUpper = employerName.toUpperCase().replace(/\s+/g, ' ');
  
  return `SAL CR/${refNum}/${employerUpper}/NEFT`;
}

// Generate interest credit
export function generateIobInterestCredit(rng: () => number = Math.random): string {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarter = quarters[randomInt(0, quarters.length - 1, rng)];
  
  return `INT CREDIT/${quarter}/FY2024-25/IOB`;
}

// Generate cheque deposit
export function generateIobChequeDeposit(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  
  return `CHQ DEP/${chequeNum}/IOB`;
}

// Generate cheque payment
export function generateIobChequePayment(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  
  return `CHQ CLR/${chequeNum}/IOB`;
}

// Generate standing instruction
export function generateIobStandingInstruction(rng: () => number = Math.random): string {
  const types = ['SIP', 'LOAN', 'INSURANCE', 'RD'];
  const type = types[randomInt(0, types.length - 1, rng)];
  const refNum = randomInt(10000000, 99999999, rng);
  
  return `SI/${type}/${refNum}/IOB`;
}

// Generate EMI debit
export function generateIobEmiDebit(rng: () => number = Math.random): string {
  const loanTypes = ['HOME', 'CAR', 'PERSONAL', 'EDUCATION'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const loanNum = randomInt(100000000, 999999999, rng);
  
  return `EMI/${loanType} LOAN/${loanNum}/IOB`;
}

// Generate debit card charges
export function generateIobDebitCardCharges(rng: () => number = Math.random): string {
  const cardLast4 = randomInt(1000, 9999, rng);
  return `DC AMC/****${cardLast4}/IOB`;
}

// Generate SMS charges
export function generateIobSmsCharges(): string {
  return `SMS CHARGES/MONTHLY/IOB`;
}

// Main function to generate realistic IOB transaction
export function generateIobRealisticTransaction(
  type: 'debit' | 'credit',
  transactionType?: string,
  rng: () => number = Math.random
): string {
  if (type === 'credit') {
    const creditTypes = [
      () => generateIobUpiCredit(rng),
      () => generateIobImpsCredit(rng),
      () => generateIobNeftCredit(rng),
      () => generateIobAchCredit(rng),
      () => generateIobCashDeposit(rng),
      () => generateIobChequeDeposit(rng),
      () => generateIobInterestCredit(rng)
    ];
    
    const generator = creditTypes[randomInt(0, creditTypes.length - 1, rng)];
    return generator();
  } else {
    const debitTypes = [
      () => generateIobUpiDebit(rng),
      () => generateIobRecharge(rng),
      () => generateIobBillPayment(rng),
      () => generateIobImpsDebit(rng),
      () => generateIobNeftDebit(rng),
      () => generateIobAchDebit(rng),
      () => generateIobAtmWithdrawal(rng),
      () => generateIobCashWithdrawal(rng),
      () => generateIobStandingInstruction(rng),
      () => generateIobEmiDebit(rng),
      () => generateIobChequePayment(rng),
      () => generateIobDebitCardCharges(rng),
      () => generateIobSmsCharges()
    ];
    
    const generator = debitTypes[randomInt(0, debitTypes.length - 1, rng)];
    return generator();
  }
}

// Export reference generator for use in generators
export { generateIobReference as default };
