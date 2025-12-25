import { randomInt, randomFloat } from '@/utils/random';

// ICICI Bank UPI transaction generator
export function generateIciciUpiTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
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
    return `UPI/${merchant.toUpperCase()}/${app}@icici/${refNumber}`;
  } else {
    return `UPI-CR/${app}@icici/${refNumber}`;
  }
}

// ICICI Bank IMPS transaction generator
export function generateIciciImpsTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const accountRef = randomInt(10000000, 99999999, rng);
  
  if (isDebit) {
    return `IMPS/DR/ICICI${refNumber}/${accountRef}`;
  } else {
    return `IMPS/CR/ICICI${refNumber}/${accountRef}`;
  }
}

// ICICI Bank NEFT transaction generator
export function generateIciciNeftTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const banks = ['HDFC', 'SBIN', 'UTIB', 'IDFB', 'KKBK', 'BARB'];
  const bank = banks[randomInt(0, banks.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const utrNumber = `ICIC${randomInt(10000000, 99999999, rng)}`;
  
  if (isDebit) {
    return `NEFT/DR/${bank}${refNumber}/${utrNumber}`;
  } else {
    return `NEFT/CR/${bank}${refNumber}/${utrNumber}`;
  }
}

// ICICI Bank RTGS transaction generator
export function generateIciciRtgsTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const banks = ['HDFC', 'SBIN', 'UTIB', 'IDFB', 'KKBK'];
  const bank = banks[randomInt(0, banks.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const utrNumber = `ICIC${randomInt(10000000, 99999999, rng)}`;
  
  if (isDebit) {
    return `RTGS/DR/${bank}${refNumber}/${utrNumber}`;
  } else {
    return `RTGS/CR/${bank}${refNumber}/${utrNumber}`;
  }
}

// ICICI Bank ATM Withdrawal
export function generateIciciAtmWithdrawal(rng: () => number = Math.random): string {
  const locations = [
    'MUMBAI', 'DELHI', 'BANGALORE', 'PUNE', 'HYDERABAD', 'CHENNAI',
    'KOLKATA', 'AHMEDABAD', 'JAIPUR', 'LUCKNOW', 'KANPUR', 'NAGPUR'
  ];
  const location = locations[randomInt(0, locations.length - 1, rng)];
  const atmId = randomInt(100000, 999999, rng);
  const cardLast4 = randomInt(1000, 9999, rng);
  
  return `ATM/WDL/${location}/${atmId}/****${cardLast4}`;
}

// ICICI Bank POS Transaction
export function generateIciciPosTransaction(rng: () => number = Math.random): string {
  const merchants = [
    'AMAZON', 'FLIPKART', 'MYNTRA', 'BIGBASKET', 'SWIGGY', 'ZOMATO',
    'UBER', 'OLA', 'BOOKMYSHOW', 'MAKEMYTRIP', 'DMart', 'RELIANCE'
  ];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const cardLast4 = randomInt(1000, 9999, rng);
  const refNumber = randomInt(100000, 999999, rng);
  
  return `POS/${merchant}/****${cardLast4}/${refNumber}`;
}

// ICICI Bank Salary Credit
export function generateIciciSalaryCredit(employerName: string, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const formats = [
    `SAL/CR/${employerName.toUpperCase()}/NEFT/${refNumber}`,
    `SALARY/${employerName.toUpperCase()}/${refNumber}`,
    `NEFT/CR/${employerName.toUpperCase()}/SAL/${refNumber}`
  ];
  return formats[randomInt(0, formats.length - 1, rng)];
}

// ICICI Bank Interest Credit
export function generateIciciInterestCredit(rng: () => number = Math.random): string {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarter = quarters[randomInt(0, quarters.length - 1, rng)];
  return `INT/CREDIT/${quarter}/FY2024-25`;
}

// ICICI Bank Debit Card Charges
export function generateIciciDebitCardCharges(rng: () => number = Math.random): string {
  const chargeTypes = [
    'DC/ANNUAL/CHARGES',
    'DC/ATM/CHARGES',
    'DC/SMS/ALERT',
    'DC/MAINTENANCE'
  ];
  return chargeTypes[randomInt(0, chargeTypes.length - 1, rng)];
}

// ICICI Bank EMI Debit
export function generateIciciEmiDebit(rng: () => number = Math.random): string {
  const loanTypes = ['HOME', 'CAR', 'PERSONAL', 'EDUCATION'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const refNumber = randomInt(100000000, 999999999, rng);
  
  return `EMI/${loanType}/LOAN/${refNumber}`;
}

// ICICI Bank Cheque Deposit
export function generateIciciChequeDeposit(rng: () => number = Math.random): string {
  const chequeNo = randomInt(100000, 999999, rng);
  return `CHQ/DEP/${chequeNo}/CLR`;
}

// ICICI Bank Cheque Payment
export function generateIciciChequePayment(rng: () => number = Math.random): string {
  const chequeNo = randomInt(100000, 999999, rng);
  return `CHQ/PAY/${chequeNo}`;
}

// ICICI Bank Standing Instruction
export function generateIciciStandingInstruction(rng: () => number = Math.random): string {
  const siTypes = ['SIP', 'INSURANCE', 'RD', 'FD'];
  const siType = siTypes[randomInt(0, siTypes.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `SI/${siType}/${refNumber}`;
}

// ICICI Bank Bill Payment
export function generateIciciBillPayment(rng: () => number = Math.random): string {
  const billers = [
    'ELECTRICITY/MSEB', 'GAS/IGL', 'WATER/BMC', 'MOBILE/AIRTEL',
    'MOBILE/JIO', 'DTH/TATASKY', 'BROADBAND/ACT', 'INSURANCE/LIC'
  ];
  const biller = billers[randomInt(0, billers.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  return `BILLPAY/${biller}/${refNumber}`;
}

// ICICI Bank Cash Deposit
export function generateIciciCashDeposit(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000, 999999999, rng);
  return `CASH/DEP/BR${randomInt(100, 999, rng)}/${refNumber}`;
}

// ICICI Bank Cash Withdrawal
export function generateIciciCashWithdrawal(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000, 999999999, rng);
  return `CASH/WDL/BR${randomInt(100, 999, rng)}/${refNumber}`;
}

// ICICI Bank Online Transfer
export function generateIciciOnlineTransfer(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  return `INET/TRF/${refNumber}`;
}

// ICICI Bank Autopay Debit
export function generateIciciAutopayDebit(rng: () => number = Math.random): string {
  const services = ['NETFLIX', 'AMAZON PRIME', 'SPOTIFY', 'GOOGLE ONE'];
  const service = services[randomInt(0, services.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `AUTOPAY/${service}/${refNumber}`;
}

// ICICI Bank Recharge
export function generateIciciRecharge(rng: () => number = Math.random): string {
  const operators = ['AIRTEL', 'JIO', 'VI', 'BSNL'];
  const operator = operators[randomInt(0, operators.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `RECHARGE/${operator}/${refNumber}`;
}

// Main function to generate realistic ICICI transaction
export function generateIciciRealisticTransaction(
  type: 'debit' | 'credit',
  specificType?: string,
  rng: () => number = Math.random
): string {
  if (type === 'debit') {
    const debitTypes = [
      () => generateIciciUpiTransaction(true, rng),
      () => generateIciciImpsTransaction(true, rng),
      () => generateIciciNeftTransaction(true, rng),
      () => generateIciciAtmWithdrawal(rng),
      () => generateIciciPosTransaction(rng),
      () => generateIciciEmiDebit(rng),
      () => generateIciciChequePayment(rng),
      () => generateIciciStandingInstruction(rng),
      () => generateIciciBillPayment(rng),
      () => generateIciciCashWithdrawal(rng),
      () => generateIciciOnlineTransfer(rng),
      () => generateIciciAutopayDebit(rng),
      () => generateIciciRecharge(rng),
      () => generateIciciDebitCardCharges(rng),
    ];
    
    if (specificType) {
      switch (specificType) {
        case 'upi': return generateIciciUpiTransaction(true, rng);
        case 'atm': return generateIciciAtmWithdrawal(rng);
        case 'pos': return generateIciciPosTransaction(rng);
        case 'emi': return generateIciciEmiDebit(rng);
        case 'bill': return generateIciciBillPayment(rng);
        default: return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
      }
    }
    
    return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
  } else {
    const creditTypes = [
      () => generateIciciUpiTransaction(false, rng),
      () => generateIciciImpsTransaction(false, rng),
      () => generateIciciNeftTransaction(false, rng),
      () => generateIciciRtgsTransaction(false, rng),
      () => generateIciciCashDeposit(rng),
      () => generateIciciChequeDeposit(rng),
      () => generateIciciInterestCredit(rng),
    ];
    
    if (specificType) {
      switch (specificType) {
        case 'upi': return generateIciciUpiTransaction(false, rng);
        case 'imps': return generateIciciImpsTransaction(false, rng);
        case 'neft': return generateIciciNeftTransaction(false, rng);
        case 'rtgs': return generateIciciRtgsTransaction(false, rng);
        case 'cash': return generateIciciCashDeposit(rng);
        case 'cheque': return generateIciciChequeDeposit(rng);
        case 'interest': return generateIciciInterestCredit(rng);
        default: return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
      }
    }
    
    return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
  }
}
