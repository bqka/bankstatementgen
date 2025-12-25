import { randomInt, randomFloat } from '@/utils/random';

// BOB (Bank of Baroda) UPI transaction generator
export function generateBobUpiTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const upiApps = [
    '464gjb8/Paytm', '056gjub/Pa', 'ggujgb@icici', 'mc5gaul/Pa', 
    '776899509/paytm@paytm/p', 'UPI/deepak.b', 'UPI/98261057'
  ];

  const merchants = [
    'Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'BigBasket', 'Grofers',
    'BookMyShow', 'Uber', 'Ola', 'MakeMyTrip', 'Airtel', 'JioMart',
    'Paytm', 'PhonePe', 'GooglePay'
  ];

  const refNumber = randomInt(100000000000, 999999999999, rng);
  const timeFormat = `${randomInt(10, 23, rng)}-${randomInt(10, 59, rng)}-${randomInt(10, 59, rng)}`;
  const app = upiApps[randomInt(0, upiApps.length - 1, rng)];
  
  if (isDebit) {
    const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
    const format = randomInt(0, 2, rng);
    
    if (format === 0) {
      // Format: UPI/522860329314/16-08-2025
      return `UPI/${refNumber}/${randomInt(10, 28, rng)}-${randomInt(1, 12, rng).toString().padStart(2, '0')}-2025`;
    } else if (format === 1) {
      // Format: UPI/527389028815/13-54-37/UPI/98261057
      return `UPI/${refNumber}/${timeFormat}/UPI/${randomInt(10000000, 99999999, rng)}`;
    } else {
      // Format: UPI/474945757542/14-08:20/UPI/98939009/056gjub/Paytm
      return `UPI/${refNumber}/${randomInt(10, 28, rng)}-${randomInt(1, 12, rng).toString().padStart(2, '0')}:${randomInt(10, 59, rng)}/UPI/${randomInt(10000000, 99999999, rng)}/${app}`;
    }
  } else {
    // Credit format: UPI/522860329314/16-08-2025
    return `UPI/${refNumber}/${randomInt(10, 28, rng)}-${randomInt(1, 12, rng).toString().padStart(2, '0')}-2025`;
  }
}

// BOB Loan Recovery transaction
export function generateBobLoanRecovery(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  return `Loan Recovery For${randomInt(1, 9, rng)}135060001687`;
}

// BOB SMS Charges
export function generateBobSmsCharges(rng: () => number = Math.random): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[randomInt(0, months.length - 1, rng)];
  return `SMS Charges for ${month}.25`;
}

// BOB Service Charges
export function generateBobServiceCharges(rng: () => number = Math.random): string {
  const chargeTypes = [
    'Service Charges for JUN.25',
    'ATM Charges',
    'Debit Card Annual Charges',
    'SMS Alert Charges'
  ];
  return chargeTypes[randomInt(0, chargeTypes.length - 1, rng)];
}

// BOB ATM Withdrawal
export function generateBobAtmWithdrawal(rng: () => number = Math.random): string {
  const locations = [
    'MUMBAI', 'DELHI', 'BANGALORE', 'PUNE', 'HYDERABAD', 'CHENNAI',
    'KOLKATA', 'AHMEDABAD', 'JAIPUR', 'LUCKNOW', 'KANPUR', 'NAGPUR'
  ];
  const location = locations[randomInt(0, locations.length - 1, rng)];
  const atmId = randomInt(100000, 999999, rng);
  const cardLast4 = randomInt(1000, 9999, rng);
  
  return `ATM WDL-${location}-${atmId}-****${cardLast4}`;
}

// BOB IMPS transaction
export function generateBobImpsTransaction(isDebit: boolean = true, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const timeFormat = `${randomInt(10, 23, rng)}-${randomInt(10, 59, rng)}-${randomInt(10, 59, rng)}`;
  
  if (isDebit) {
    return `UPI/${refNumber}/${timeFormat}/UPI/${randomInt(10000000, 99999999, rng)}`;
  } else {
    return `IMPS-CR-BOB${refNumber}-${randomInt(10000000, 99999999, rng)}`;
  }
}

// BOB NEFT transaction
export function generateBobNeftTransaction(isDebit: boolean = false, rng: () => number = Math.random): string {
  const banks = ['HDFC', 'ICIC', 'SBIN', 'UTIB', 'IDFB', 'KKBK', 'BARB'];
  const bank = banks[randomInt(0, banks.length - 1, rng)];
  const refNumber = randomInt(1000000000, 9999999999, rng);
  const utrNumber = `${bank}${randomInt(10000000, 99999999, rng)}`;
  
  if (isDebit) {
    return `NEFT-DR-${bank}${refNumber}-${utrNumber}`;
  } else {
    return `NEFT-CR-${bank}${refNumber}-${utrNumber}`;
  }
}

// BOB Salary Credit
export function generateBobSalaryCredit(employerName: string, rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000000, 999999999999, rng);
  const formats = [
    `SALARY FROM ${employerName.toUpperCase()}-NEFT-${refNumber}`,
    `SAL CR-${employerName.toUpperCase()}-${refNumber}`,
    `${employerName.toUpperCase()}/SAL/${refNumber}`
  ];
  return formats[randomInt(0, formats.length - 1, rng)];
}

// BOB Interest Credit
export function generateBobInterestCredit(rng: () => number = Math.random): string {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarter = quarters[randomInt(0, quarters.length - 1, rng)];
  return `INT.CREDIT ${quarter}-FY2024-25`;
}

// BOB Bill Payment
export function generateBobBillPayment(rng: () => number = Math.random): string {
  const billers = [
    'ELECTRICITY-MSEB', 'GAS-IGL', 'WATER-BMC', 'MOBILE-AIRTEL',
    'MOBILE-JIO', 'DTH-TATASKY', 'BROADBAND-ACT', 'INSURANCE-LIC'
  ];
  const biller = billers[randomInt(0, billers.length - 1, rng)];
  const refNumber = randomInt(100000000000, 999999999999, rng);
  
  return `BILLPAY-${biller}-${refNumber}`;
}

// BOB Cash Deposit
export function generateBobCashDeposit(rng: () => number = Math.random): string {
  const refNumber = randomInt(100000000, 999999999, rng);
  return `CASH DEP-BR${randomInt(100, 999, rng)}-${refNumber}`;
}

// BOB Cheque Deposit
export function generateBobChequeDeposit(rng: () => number = Math.random): string {
  const chequeNo = randomInt(100000, 999999, rng);
  return `CHQ DEP-${chequeNo}-CLR`;
}

// BOB EMI Debit
export function generateBobEmiDebit(rng: () => number = Math.random): string {
  const loanTypes = ['HOME', 'CAR', 'PERSONAL', 'EDUCATION'];
  const loanType = loanTypes[randomInt(0, loanTypes.length - 1, rng)];
  const refNumber = randomInt(100000000, 999999999, rng);
  
  return `EMI-${loanType} LOAN-${refNumber}`;
}

// BOB Standing Instruction
export function generateBobStandingInstruction(rng: () => number = Math.random): string {
  const siTypes = ['SIP', 'INSURANCE', 'RD', 'FD'];
  const siType = siTypes[randomInt(0, siTypes.length - 1, rng)];
  const refNumber = randomInt(10000000, 99999999, rng);
  
  return `SI-${siType}-${refNumber}`;
}

// BOB Debit Card Transaction
export function generateBobDebitCardTransaction(rng: () => number = Math.random): string {
  const merchants = [
    'AMAZON', 'FLIPKART', 'MYNTRA', 'BIGBASKET', 'SWIGGY', 'ZOMATO',
    'UBER', 'OLA', 'BOOKMYSHOW', 'MAKEMYTRIP'
  ];
  const merchant = merchants[randomInt(0, merchants.length - 1, rng)];
  const cardLast4 = randomInt(1000, 9999, rng);
  
  return `DC-${merchant}-****${cardLast4}`;
}

// Main function to generate realistic BOB transaction
export function generateBobRealisticTransaction(
  type: 'debit' | 'credit',
  specificType?: string,
  rng: () => number = Math.random
): string {
  if (type === 'debit') {
    const debitTypes = [
      () => generateBobUpiTransaction(true, rng),
      () => generateBobImpsTransaction(true, rng),
      () => generateBobAtmWithdrawal(rng),
      () => generateBobBillPayment(rng),
      () => generateBobEmiDebit(rng),
      () => generateBobDebitCardTransaction(rng),
      () => generateBobServiceCharges(rng),
      () => generateBobSmsCharges(rng),
      () => generateBobLoanRecovery(rng),
      () => generateBobStandingInstruction(rng),
    ];
    
    if (specificType) {
      switch (specificType) {
        case 'upi': return generateBobUpiTransaction(true, rng);
        case 'atm': return generateBobAtmWithdrawal(rng);
        case 'bill': return generateBobBillPayment(rng);
        case 'emi': return generateBobEmiDebit(rng);
        default: return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
      }
    }
    
    return debitTypes[randomInt(0, debitTypes.length - 1, rng)]();
  } else {
    const creditTypes = [
      () => generateBobUpiTransaction(false, rng),
      () => generateBobImpsTransaction(false, rng),
      () => generateBobNeftTransaction(false, rng),
      () => generateBobCashDeposit(rng),
      () => generateBobChequeDeposit(rng),
      () => generateBobInterestCredit(rng),
    ];
    
    if (specificType) {
      switch (specificType) {
        case 'upi': return generateBobUpiTransaction(false, rng);
        case 'neft': return generateBobNeftTransaction(false, rng);
        case 'cash': return generateBobCashDeposit(rng);
        case 'cheque': return generateBobChequeDeposit(rng);
        case 'interest': return generateBobInterestCredit(rng);
        default: return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
      }
    }
    
    return creditTypes[randomInt(0, creditTypes.length - 1, rng)]();
  }
}
