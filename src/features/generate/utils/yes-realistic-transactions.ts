import { randomInt } from '@/utils/random';

// YES Bank realistic transaction generators based on real statement analysis

// Common Indian names for UPI
const PERSON_NAMES = [
  'DIVYANSH PATEL', 'MAYANK SAHU', 'ANIKET PATEL', 'SATENDRA PATEL',
  'PRADEEP KUMAR', 'RAJESH SHARMA', 'AMIT VERMA', 'NEHA SINGH',
  'VIKRAM GUPTA', 'PRIYA MEHTA', 'RAHUL MISHRA', 'SNEHA REDDY',
  'KARAN SINGH', 'POOJA SHARMA', 'ARUN KUMAR', 'DEEPAK YADAV',
  'SANJAY PATEL', 'ANJALI GUPTA', 'MANOJ TIWARI', 'KAVITA SINGH'
];

// Merchant names for business VPAs
const BUSINESS_NAMES = [
  'maheshwripetroleum', 'relianc efresh', 'kiranamartshop', 'medicalstore',
  'petrolpump', 'restaurantcafe', 'grocerymart', 'mobileshop',
  'clothingstore', 'electronicshop', 'bookstall', 'stationary'
];

// UPI handles (VPAs)
const UPI_HANDLES = ['@ybl', '@ibl', '@paytm', '@ptys', '@okbizaxis', '@hdfcbank', '@axisbank'];

// Payment apps
const PAYMENT_APPS = [
  'Payment from PhonePe',
  'Payment from GPay',
  'Payment from Paytm',
  'Payment from BHIM UPI',
  'Payment from Amazon Pay'
];

/**
 * Generate YES Bank reference number
 * Format: YBS + 13 digits (date-based sequence)
 */
export function generateYesReference(date: Date, rng: () => number = Math.random): string {
  const year = date.getFullYear() % 100; // Last 2 digits
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const sequence = randomInt(1000, 9999, rng);
  
  // YBS + day_of_year (3 digits) + year (2 digits) + random sequence (8 digits)
  const refNum = `${dayOfYear.toString().padStart(3, '0')}${year}${randomInt(10000000, 99999999, rng)}`;
  return `YBS${refNum.substring(0, 13)}`;
}

/**
 * Generate phone-based VPA
 * Formats: {phone}@ybl or {phone}-{digit}@ybl
 */
function generatePersonVPA(rng: () => number = Math.random): string {
  const phone = `${randomInt(7, 9, rng)}${randomInt(100000000, 999999999, rng)}`;
  const handle = UPI_HANDLES[randomInt(0, 2, rng)]; // Prefer @ybl and @ibl
  
  // 70% plain phone, 30% phone with suffix
  if (rng() < 0.7) {
    return `${phone}${handle}`;
  } else {
    const suffix = randomInt(1, 5, rng);
    return `${phone}-${suffix}${handle}`;
  }
}

/**
 * Generate Q-code merchant VPA
 * Format: Q{9-digits}@ybl
 */
function generateQCodeVPA(rng: () => number = Math.random): string {
  const qCode = randomInt(100000000, 999999999, rng);
  return `Q${qCode}@ybl`;
}

/**
 * Generate Paytm QR code
 * Formats: paytmqr{hash}@ptys or paytm.{hash}@pty
 */
function generatePaytmQR(rng: () => number = Math.random): string {
  // Generate random alphanumeric hash (5-8 chars)
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = randomInt(5, 8, rng);
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(rng() * chars.length)];
  }
  
  // 60% paytmqr format, 40% paytm. format
  if (rng() < 0.6) {
    return `paytmqr${hash}@ptys`;
  } else {
    return `paytm.${hash}@pty`;
  }
}

/**
 * Generate business VPA
 * Format: {name}.{numbers}@hdfcbank or Vyapar.{12-digits}@hdfcbank
 */
function generateBusinessVPA(rng: () => number = Math.random): string {
  // 30% Vyapar accounting software, 70% regular business
  if (rng() < 0.3) {
    const vyaparId = randomInt(100000000000, 999999999999, rng);
    return `Vyapar.${vyaparId}@hdfcbank`;
  } else {
    const business = BUSINESS_NAMES[randomInt(0, BUSINESS_NAMES.length - 1, rng)];
    const businessId = randomInt(10000000, 99999999, rng);
    return `${business}.${businessId}@hdfcbank`;
  }
}

/**
 * Generate UPI debit transaction
 * Format: UPI/{ref}/From:{sender}/To:{receiver}/Payment from {app}
 */
export function generateYesUpiDebit(rng: () => number = Math.random): { description: string; amount: number } {
  const upiRef = randomInt(100000000000, 999999999999, rng);
  const senderPhone = `${randomInt(7, 9, rng)}${randomInt(100000000, 999999999, rng)}`;
  const paymentApp = PAYMENT_APPS[randomInt(0, PAYMENT_APPS.length - 1, rng)];
  
  // Determine recipient type
  const recipientType = rng();
  let recipient: string;
  
  if (recipientType < 0.35) {
    // 35% - Person to person
    recipient = generatePersonVPA(rng);
  } else if (recipientType < 0.70) {
    // 35% - Q-code merchant
    recipient = generateQCodeVPA(rng);
  } else if (recipientType < 0.85) {
    // 15% - Paytm QR
    recipient = generatePaytmQR(rng);
  } else {
    // 15% - Business VPA
    recipient = generateBusinessVPA(rng);
  }
  
  const description = `UPI/${upiRef}/From:${senderPhone}@ybl/To:${recipient}/${paymentApp}`;
  
  // REALISTIC amount distribution: Most transactions should be small
  const amountRand = rng();
  let amount: number;
  if (amountRand < 0.60) {
    amount = randomInt(50, 800, rng); // 60% small everyday transactions
  } else if (amountRand < 0.85) {
    amount = randomInt(800, 2500, rng); // 25% medium
  } else if (amountRand < 0.96) {
    amount = randomInt(2500, 5000, rng); // 11% larger
  } else {
    amount = randomInt(5000, 10000, rng); // 4% rare large payments
  }
  
  return { description, amount };
}

/**
 * Generate UPI credit transaction
 * Format: UPI/{ref}/From:{sender}/To:{receiver}/Payment from {app}
 */
export function generateYesUpiCredit(rng: () => number = Math.random): { description: string; amount: number } {
  const upiRef = randomInt(100000000000, 999999999999, rng);
  const receiverPhone = `${randomInt(7, 9, rng)}${randomInt(100000000, 999999999, rng)}`;
  const paymentApp = PAYMENT_APPS[randomInt(0, PAYMENT_APPS.length - 1, rng)];
  
  // For credits, sender is usually a person (80%) or business (20%)
  let sender: string;
  if (rng() < 0.8) {
    sender = generatePersonVPA(rng);
  } else {
    sender = generateBusinessVPA(rng);
  }
  
  const description = `UPI/${upiRef}/From:${sender}/To:${receiverPhone}@ybl/${paymentApp}`;
  
  // REALISTIC credit amounts - tiered distribution
  const amountRand = rng();
  let amount: number;
  if (amountRand < 0.65) {
    amount = randomInt(200, 2000, rng); // 65% small credits
  } else if (amountRand < 0.88) {
    amount = randomInt(2000, 5000, rng); // 23% medium
  } else if (amountRand < 0.97) {
    amount = randomInt(5000, 8000, rng); // 9% larger
  } else {
    amount = randomInt(8000, 12000, rng); // 3% rare large credits
  }
  
  return { description, amount };
}

/**
 * Generate realistic YES Bank transaction
 */
export function generateYesRealisticTransaction(
  type: 'debit' | 'credit',
  date: Date,
  rng: () => number = Math.random
): { description: string; reference: string; amount: number } {
  const reference = generateYesReference(date, rng);
  
  // 90% UPI, 5% cash, 5% other
  const txnType = rng();
  
  if (txnType < 0.9) {
    // UPI transaction
    const upi = type === 'debit' 
      ? generateYesUpiDebit(rng)
      : generateYesUpiCredit(rng);
    
    return {
      description: upi.description,
      reference,
      amount: upi.amount
    };
  } else if (txnType < 0.95) {
    // Cash deposit/withdrawal
    const amount = randomInt(500, 10000, rng);
    const description = type === 'debit'
      ? 'CASH WITHDRAWAL AT BRANCH'
      : 'CASH DEPOSIT AT BRANCH';
    
    return { description, reference, amount };
  } else {
    // NEFT/IMPS (rare in modern statements) - REALISTIC tiered amounts
    const name = PERSON_NAMES[randomInt(0, PERSON_NAMES.length - 1, rng)];
    const txnId = randomInt(100000000000, 999999999999, rng);
    
    const amountType = rng();
    let amount: number;
    if (amountType < 0.65) {
      amount = randomInt(1500, 6000, rng); // 65% moderate
    } else if (amountType < 0.88) {
      amount = randomInt(6000, 12000, rng); // 23% medium
    } else {
      amount = randomInt(12000, 20000, rng); // 12% larger (rarely)
    }
    
    const mode = rng() < 0.5 ? 'NEFT' : 'IMPS';
    const description = type === 'debit'
      ? `${mode}/DR/${txnId}/${name}`
      : `${mode}/CR/${txnId}/${name}`;
    
    return { description, reference, amount };
  }
}
