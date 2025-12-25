import { randomInt } from '@/utils/random';

// IndusInd Bank transaction generators based on real statement patterns

const UPI_MERCHANTS = [
  'Goog', 'YADA', 'Bank', 'SONU', 'VISH', 'Daya', 'GAJR', 'APNA', 'Bhar', 
  'JAIN', 'PAYT', 'PHON', 'AMAZ', 'FLIP', 'SWIG', 'ZOMA', 'UBER', 'RAPI'
];

const UPI_BANKS = ['UTIB', 'YESB', 'ICIC', 'SBIN', 'FDRL', 'INDB', 'HDFC', 'AXIS'];

const UPI_HANDLES = [
  'harge@okpayaxis', 'tmqr5yvj34@ptys', 'yrecharge@icici', 'ytm.s1lj9aj@pty',
  'Q550680659@ybl', '0071040013@fbpe', '7806070285@axl', '831927974@axl',
  '672916@hdfcbank', 'paytm@paytm', 'phonepe@ybl', 'gpay@okaxis', 
  'amazonpay@apl', 'freecharge@icici', 'mobikwik@icici'
];

// Generate IndusInd reference number (S followed by 8 digits)
function generateIndusindReference(rng: () => number = Math.random): string {
  return `S${randomInt(10000000, 99999999, rng)}`;
}

// Generate UPI debit transaction
export function generateIndusindUpiDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const merchant = UPI_MERCHANTS[randomInt(0, UPI_MERCHANTS.length - 1, rng)];
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  const handle = UPI_HANDLES[randomInt(0, UPI_HANDLES.length - 1, rng)];
  
  return `UPI/${refNum}/DR/${merchant}/${bank}/${handle}`;
}

// Generate UPI credit transaction
export function generateIndusindUpiCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const merchant = UPI_MERCHANTS[randomInt(0, UPI_MERCHANTS.length - 1, rng)];
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  const handle = UPI_HANDLES[randomInt(0, UPI_HANDLES.length - 1, rng)];
  
  return `UPI/${refNum}/CR/${merchant}/${bank}/${handle}/`;
}

// Generate IMPS debit transaction
export function generateIndusindImpsDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  
  return `IMPS/${refNum}/DR/${bank}`;
}

// Generate IMPS credit transaction
export function generateIndusindImpsCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  
  return `IMPS/${refNum}/CR/${bank}/`;
}

// Generate NEFT debit transaction
export function generateIndusindNeftDebit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  
  return `NEFT/${refNum}/DR/${bank}`;
}

// Generate NEFT credit transaction
export function generateIndusindNeftCredit(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const bank = UPI_BANKS[randomInt(0, UPI_BANKS.length - 1, rng)];
  
  return `NEFT/${refNum}/CR/${bank}/`;
}

// Generate ATM withdrawal
export function generateIndusindAtmWithdrawal(rng: () => number = Math.random): string {
  const locations = ['MUMBAI', 'DELHI', 'BANGALORE', 'PUNE', 'HYDERABAD', 'CHENNAI'];
  const location = locations[randomInt(0, locations.length - 1, rng)];
  const atmId = randomInt(100000, 999999, rng);
  
  return `ATM/${atmId}/WDL/${location}`;
}

// Generate POS transaction
export function generateIndusindPosTransaction(rng: () => number = Math.random): string {
  const merchants = ['AMAZON', 'FLIPKART', 'SWIGGY', 'ZOMATO', 'DMart', 'RELIANCE'];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const refNum = randomInt(100000000000, 999999999999, rng);
  const cardLast4 = randomInt(1000, 9999, rng);
  
  return `POS/${refNum}/DR/${merchant}/****${cardLast4}`;
}

// Generate salary credit
export function generateIndusindSalaryCredit(employerName: string, rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const employerUpper = employerName.toUpperCase().replace(/\s+/g, '');
  
  return `SAL/${refNum}/CR/${employerUpper}/NEFT`;
}

// Generate interest credit
export function generateIndusindInterestCredit(rng: () => number = Math.random): string {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarter = quarters[randomInt(0, quarters.length - 1, rng)];
  
  return `INT/CREDIT/${quarter}/FY2024-25`;
}

// Generate debit card charges
export function generateIndusindDebitCardCharges(rng: () => number = Math.random): string {
  const cardLast4 = randomInt(1000, 9999, rng);
  return `DC/AMC/****${cardLast4}`;
}

// Generate SMS charges
export function generateIndusindSmsCharges(): string {
  return `SMS/CHARGES/MONTHLY`;
}

// Generate bill payment
export function generateIndusindBillPayment(rng: () => number = Math.random): string {
  const billers = ['ELECTRICITY', 'WATER', 'GAS', 'MOBILE', 'DTH', 'BROADBAND'];
  const biller = billers[randomInt(0, billers.length - 1, rng)];
  const refNum = randomInt(100000000000, 999999999999, rng);
  
  return `BILL/${refNum}/DR/${biller}`;
}

// Generate cash deposit
export function generateIndusindCashDeposit(rng: () => number = Math.random): string {
  const branchCodes = ['0001', '0012', '0023', '0045', '0067'];
  const branch = branchCodes[randomInt(0, branchCodes.length - 1, rng)];
  
  return `CASH/DEP/BR/${branch}`;
}

// Generate cash withdrawal
export function generateIndusindCashWithdrawal(rng: () => number = Math.random): string {
  const branchCodes = ['0001', '0012', '0023', '0045', '0067'];
  const branch = branchCodes[randomInt(0, branchCodes.length - 1, rng)];
  
  return `CASH/WDL/BR/${branch}`;
}

// Generate standing instruction
export function generateIndusindStandingInstruction(rng: () => number = Math.random): string {
  const types = ['SIP', 'LOAN', 'INSURANCE', 'RD'];
  const type = types[randomInt(0, types.length - 1, rng)];
  const refNum = randomInt(10000000, 99999999, rng);
  
  return `SI/${type}/${refNum}`;
}

// Generate EMI debit
export function generateIndusindEmiDebit(rng: () => number = Math.random): string {
  const loanTypes = ['HOME', 'CAR', 'PERSONAL', 'EDUCATION'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const loanNum = randomInt(100000000, 999999999, rng);
  
  return `EMI/${loanType}/${loanNum}`;
}

// Generate cheque deposit
export function generateIndusindChequeDeposit(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  
  return `CHQ/DEP/${chequeNum}`;
}

// Generate cheque payment
export function generateIndusindChequePayment(rng: () => number = Math.random): string {
  const chequeNum = randomInt(100000, 999999, rng);
  
  return `CHQ/CLR/${chequeNum}`;
}

// Generate mobile recharge
export function generateIndusindMobileRecharge(rng: () => number = Math.random): string {
  const refNum = randomInt(100000000000, 999999999999, rng);
  const providers = ['JIO', 'AIRTEL', 'VI', 'BSNL'];
  const provider = providers[randomInt(0, providers.length - 1, rng)];
  
  return `UPI/${refNum}/DR/Goog/UTIB/yrecharge@icici`;
}

// Generate autopay debit
export function generateIndusindAutopayDebit(rng: () => number = Math.random): string {
  const services = ['NETFLIX', 'AMAZON', 'SPOTIFY', 'YOUTUBE'];
  const service = services[randomInt(0, services.length - 1, rng)];
  const refNum = randomInt(100000000000, 999999999999, rng);
  
  return `AUTOPAY/${refNum}/DR/${service}`;
}

// Main function to generate realistic IndusInd transaction
export function generateIndusindRealisticTransaction(
  type: 'debit' | 'credit',
  transactionType?: string,
  rng: () => number = Math.random
): string {
  if (type === 'credit') {
    const creditTypes = [
      () => generateIndusindUpiCredit(rng),
      () => generateIndusindImpsCredit(rng),
      () => generateIndusindNeftCredit(rng),
      () => generateIndusindCashDeposit(rng),
      () => generateIndusindChequeDeposit(rng),
      () => generateIndusindInterestCredit(rng)
    ];
    
    const generator = creditTypes[randomInt(0, creditTypes.length - 1, rng)];
    return generator();
  } else {
    const debitTypes = [
      () => generateIndusindUpiDebit(rng),
      () => generateIndusindImpsDebit(rng),
      () => generateIndusindNeftDebit(rng),
      () => generateIndusindAtmWithdrawal(rng),
      () => generateIndusindPosTransaction(rng),
      () => generateIndusindBillPayment(rng),
      () => generateIndusindCashWithdrawal(rng),
      () => generateIndusindStandingInstruction(rng),
      () => generateIndusindEmiDebit(rng),
      () => generateIndusindChequePayment(rng),
      () => generateIndusindMobileRecharge(rng),
      () => generateIndusindAutopayDebit(rng),
      () => generateIndusindDebitCardCharges(rng),
      () => generateIndusindSmsCharges()
    ];
    
    const generator = debitTypes[randomInt(0, debitTypes.length - 1, rng)];
    return generator();
  }
}

// Export reference generator for use in generators
export { generateIndusindReference };
