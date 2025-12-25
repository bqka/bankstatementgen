import { addMonths, subDays } from 'date-fns';
import { Statement, Transaction } from '@/types/statement';
import { createSeededRng, randomFloat, randomId, randomInt } from '@/utils/random';
import { buildReference } from './reference';
import { SalariedFormValues } from './types';
import { generateRealisticSbiTransaction, setSbiUserLocation } from './sbi-realistic-transactions';
import { generateRealisticHdfcTransaction } from './hdfc-realistic-transactions';
import { generateIdfcRealisticTransaction, generateIdfcSalaryCredit } from './idfc-realistic-transactions';
import { generatePnbRealisticTransaction, generatePnbSalaryCredit } from './pnb-realistic-transactions';
import { generateAxisRealisticTransaction, generateAxisSalaryCredit } from './axis-realistic-transactions';
import { generateBobRealisticTransaction, generateBobSalaryCredit } from './bob-realistic-transactions';
import { generateIciciRealisticTransaction, generateIciciSalaryCredit } from './icici-realistic-transactions';
import { generateIndusindRealisticTransaction, generateIndusindSalaryCredit, generateIndusindReference } from './indusind-realistic-transactions';
import { generateIobRealisticTransaction, generateIobSalaryCredit, generateIobReference } from './iob-realistic-transactions';
import { generateYesRealisticTransaction, generateYesReference } from './yes-realistic-transactions';
import { generateUcoRealisticTransaction, generateUcoReference } from './uco-realistic-transactions';
import { generateKotakRealisticTransaction, generateKotakSalaryCredit, generateKotakReference } from './kotak-realistic-transactions';
import { generateCanaraRealisticTransaction, generateCanaraSalaryCredit, generateCanaraReference } from './canara-realistic-transactions';
import { generateUnionRealisticTransaction, generateUnionSalaryCredit, generateUnionReference } from './union-realistic-transactions';

interface Options {
  seed: number;
}

// Helper function to adjust date to previous weekday if it falls on weekend
const adjustToWeekday = (date: Date): Date => {
  const day = date.getDay();
  const adjustedDate = new Date(date);
  
  if (day === 0) {
    // Sunday -> move to Friday (2 days back)
    adjustedDate.setDate(adjustedDate.getDate() - 2);
  } else if (day === 6) {
    // Saturday -> move to Friday (1 day back)
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }
  
  return adjustedDate;
};

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

const pickSalaryDayWithinRange = (minDay: number, maxDay: number, rng: () => number): number => {
  const ranges: { start: number; end: number; weight: number }[] = [];
  const addRange = (start: number, end: number, weight: number) => {
    const rangeStart = Math.max(start, minDay);
    const rangeEnd = Math.min(end, maxDay);
    if (rangeStart <= rangeEnd) {
      ranges.push({ start: rangeStart, end: rangeEnd, weight });
    }
  };

  addRange(1, 3, 0.6);
  addRange(4, 5, 0.4);

  if (!ranges.length) {
    return minDay;
  }

  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);
  let target = rng() * totalWeight;

  for (const range of ranges) {
    if (target < range.weight) {
      return randomInt(range.start, range.end, rng);
    }
    target -= range.weight;
  }

  const fallbackRange = ranges[ranges.length - 1];
  return randomInt(fallbackRange.start, fallbackRange.end, rng);
};

const adjustSalaryDateWithinWindow = (date: Date, minDay: number, maxDay: number): Date => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const withinWindow = (candidate: Date) =>
    candidate.getFullYear() === year &&
    candidate.getMonth() === month &&
    candidate.getDate() >= minDay &&
    candidate.getDate() <= maxDay;

  // If current date is valid weekday within window, use it
  if (withinWindow(date) && isWeekday(date)) {
    return date;
  }

  // Try adjusting forward first (preferred for start of period)
  const forward = new Date(date);
  while (withinWindow(forward)) {
    if (isWeekday(forward)) {
      return forward;
    }
    forward.setDate(forward.getDate() + 1);
  }

  // Try adjusting backward (but never before minDay)
  const backward = new Date(date);
  backward.setDate(backward.getDate() - 1);
  while (withinWindow(backward) && backward.getDate() >= minDay) {
    if (isWeekday(backward)) {
      return backward;
    }
    backward.setDate(backward.getDate() - 1);
  }

  // Last resort: find any weekday within the window
  for (let day = minDay; day <= maxDay; day += 1) {
    const candidate = new Date(year, month, day);
    if (isWeekday(candidate)) {
      return candidate;
    }
  }

  // Absolute fallback: return minDay (should rarely happen)
  return new Date(year, month, minDay);
};

const getSalaryDates = (durationMonths: number, endDate: Date, startDate: Date | null, rng: () => number) => {
  const dates: Date[] = [];
  
  // Extract local date components for reliable comparison
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();
  
  const startYear = startDate?.getFullYear();
  const startMonth = startDate?.getMonth();
  const startDay = startDate?.getDate();
  
  for (let i = durationMonths - 1; i >= 0; i -= 1) {
    const monthDate = addMonths(endDate, -i);
    const currentYear = monthDate.getFullYear();
    const currentMonth = monthDate.getMonth();
    
    const isEndMonth = currentYear === endYear && currentMonth === endMonth;
    const isStartMonth = startDate && 
      currentYear === startYear && 
      currentMonth === startMonth;
    
    let minDay = 1;
    let maxDay = 5;
    
    // For the starting month, adjust min/max based on start date
    if (isStartMonth && startDay !== undefined) {
      // Only include salary in starting month if it starts between 1-5
      if (startDay >= 1 && startDay <= 5) {
        minDay = startDay; // Salary must be on or after the start date
        maxDay = 5; // But still within 1-5 range
      } else {
        // If start date is after 5th, skip this month's salary
        continue;
      }
    }
    
    // For the ending month, don't go beyond the end date
    if (isEndMonth) {
      maxDay = Math.min(5, endDay);
    }
    
    // Ensure maxDay is at least minDay
    maxDay = Math.max(minDay, maxDay);
    
    const salaryDay = pickSalaryDayWithinRange(minDay, maxDay, rng);

    // Create salary date in the correct month with the picked day
    let salaryDate = new Date(currentYear, currentMonth, salaryDay, 12, 0, 0);
    salaryDate = adjustSalaryDateWithinWindow(salaryDate, minDay, maxDay);

    dates.push(salaryDate);
  }

  return dates;
};

const createTable = (
  values: SalariedFormValues,
  rng: () => number
): Transaction[] => {
  // Set user location from form data for location-aware transactions
  if (values.template === 'SBI') {
    setSbiUserLocation(values.city, values.branchAddress);
    // Reset used names to prevent circular transaction patterns
    const { resetUsedNames } = require('./sbi-realistic-transactions');
    resetUsedNames();
  }
  
  const salarySource = values.customEmployer?.trim() || values.employer;
  
  // Use dates directly from form (already Date objects, not ISO strings)
  let endDate: Date;
  let startDate: Date | null = null;
  
  if (values.statementEndDate) {
    endDate = values.statementEndDate;
  } else {
    endDate = new Date();
  }
  
  if (values.statementStartDate) {
    startDate = values.statementStartDate;
  }
  
  // Calculate duration: if both dates provided, calculate from range; otherwise use durationMonths
  let actualDuration = values.durationMonths;
  
  // If both dates provided, calculate duration from range
  if (startDate && values.statementEndDate) {
    // Calculate actual month difference properly
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff + 1; // +1 because we include both start and end months
    actualDuration = Math.max(3, Math.min(6, totalMonths)); // Clamp between 3-6 months
  }
  
  const salaryDates = getSalaryDates(actualDuration, endDate, startDate, rng);
  const transactions: Transaction[] = [];

  let runningBalance = values.startingBalance;

  // Calculate total number of transactions needed
  const totalTransactions = values.numberOfTransactions;
  const salaryTransactions = salaryDates.length;
  const interestTransactions = salaryDates.length; // One interest per month
  const reservedTransactions = salaryTransactions + interestTransactions;
  
  // Remaining transactions for expenses/debits
  const remainingTransactions = Math.max(0, totalTransactions - reservedTransactions);
  
  // Calculate transactions per period (evenly distributed)
  const transactionsPerMonth = Math.floor(remainingTransactions / values.durationMonths);
  let extraTransactions = remainingTransactions % values.durationMonths;

  salaryDates.forEach((date, monthIndex) => {
    // Calculate how many debit transactions for this period
    let monthlyDebitCount = transactionsPerMonth;
    if (extraTransactions > 0) {
      monthlyDebitCount++;
      extraTransactions--;
    }

    const creditAmount = randomFloat(values.salaryAmount * 0.98, values.salaryAmount * 1.02, 2, rng);
    runningBalance += creditAmount;
    
    // Generate realistic salary credit for SBI, HDFC, IDFC, PNB, and Axis
    let salaryDescription: string;
    let salaryReference: string;
    
    if (values.template === 'SBI') {
      const bankCodes = ['KKBK', 'HDFC', 'ICIC', 'SBIN', 'PUNB'];
      const refNumber = randomInt(1000000000, 9999999999, rng);
      const bankCode = bankCodes[randomInt(0, bankCodes.length - 1, rng)];
      const branchCode = randomInt(1000, 9999, rng);
      const accountDigits = randomInt(10000000, 99999999, rng);
      
      salaryDescription = `BY TRANSFER-\nNEFT*${bankCode}${branchCode}*P${accountDigits.toString().substring(0, 8)}\n${refNumber}*${salarySource.toUpperCase()}\nLIMITED*Salary`;
      salaryReference = `TRANSFER\n FROM\n 995${randomInt(10000000, 99999999, rng)}`;
    } else if (values.template === 'HDFC') {
      const bankCodes = ['ICIC', 'SBIN', 'HDFC', 'AXIS'];
      const bankCode = bankCodes[randomInt(0, bankCodes.length - 1, rng)];
      const refNumber = randomInt(100000000000, 999999999999, rng);
      
      salaryDescription = `NEFT CR-${bankCode}${String(randomInt(0, 999999999, rng)).padStart(10, '0')}-${salarySource.toUpperCase()}-AXISP ${String(refNumber).substring(0, 12)}`;
      salaryReference = `AXISP${String(randomInt(100000000, 999999999, rng))}`;
    } else if (values.template === 'IDFC') {
      const salaryData = generateIdfcSalaryCredit(date, salarySource);
      salaryDescription = salaryData.description;
      salaryReference = '';
    } else if (values.template === 'PNB') {
      salaryDescription = generatePnbSalaryCredit(salarySource);
      salaryReference = String(randomInt(10000000, 99999999, rng));
    } else if (values.template === 'AXIS') {
      salaryDescription = generateAxisSalaryCredit(salarySource, rng);
      salaryReference = '';
    } else if (values.template === 'BOB') {
      salaryDescription = generateBobSalaryCredit(salarySource, rng);
      salaryReference = '';
    } else if (values.template === 'ICICI') {
      salaryDescription = generateIciciSalaryCredit(salarySource, rng);
      salaryReference = '';
    } else if (values.template === 'INDUSIND') {
      salaryDescription = generateIndusindSalaryCredit(salarySource, rng);
      salaryReference = generateIndusindReference(rng);
    } else if (values.template === 'IOB') {
      salaryDescription = generateIobSalaryCredit(salarySource, rng);
      salaryReference = generateIobReference(rng);
    } else if (values.template === 'YES') {
      // YES Bank salary credit via NEFT/IMPS
      const txnData = generateYesRealisticTransaction('credit', date, rng);
      salaryDescription = txnData.description.replace(/UPI\/.*/, `NEFT/CR/${randomInt(100000000000, 999999999999, rng)}/${salarySource.toUpperCase()}`);
      salaryReference = txnData.reference;
    } else if (values.template === 'UCO') {
      // UCO Bank salary credit via NEFT
      const ref = randomInt(1000000000, 9999999999, rng);
      salaryDescription = `NEFT CR-N${ref}-${salarySource.toUpperCase()}`;
      salaryReference = generateUcoReference(date, rng);
    } else if (values.template === 'KOTAK') {
      // Kotak Bank salary credit
      salaryDescription = generateKotakSalaryCredit(salarySource, rng);
      salaryReference = generateKotakReference(date, rng);
    } else if (values.template === 'CANARA') {
      // Canara Bank salary credit
      salaryDescription = generateCanaraSalaryCredit(salarySource, rng);
      salaryReference = generateCanaraReference(date, rng);
    } else if (values.template === 'UNION') {
      // Union Bank salary credit
      salaryDescription = generateUnionSalaryCredit(salarySource, rng);
      salaryReference = generateUnionReference(date, rng);
    } else {
      salaryDescription = `Salary from ${salarySource}`;
      salaryReference = buildReference('salary', rng);
    }
    
    transactions.push({
      id: randomId(rng),
      date: date.toISOString(),
      description: salaryDescription,
      reference: salaryReference,
      debit: 0,
      credit: creditAmount,
      balance: parseFloat(runningBalance.toFixed(2))
    });

    // Generate debit transactions for this month
    for (let i = 0; i < monthlyDebitCount; i += 1) {
      // Spread transactions throughout the entire month (before AND after salary date)
      const salaryYear = date.getFullYear();
      const salaryMonth = date.getMonth();
      
      // Calculate the month's start and end dates
      const monthStart = new Date(salaryYear, salaryMonth, 1, 12, 0, 0);
      const monthEnd = new Date(salaryYear, salaryMonth + 1, 0, 23, 59, 59); // Last day of month
      
      // For start month, respect the statement start date
      const effectiveStart = (startDate && salaryYear === startDate.getFullYear() && salaryMonth === startDate.getMonth())
        ? startDate
        : monthStart;
      
      // For end month, respect the statement end date  
      const effectiveEnd = (endDate && salaryYear === endDate.getFullYear() && salaryMonth === endDate.getMonth())
        ? endDate
        : monthEnd;
      
      // CRITICAL: Avoid transactions clustering around salary date (prevents bulk UPI flags)
      // Create buffer zones: 3 days before salary and 1 day after
      const salaryTime = date.getTime();
      const threeDaysBefore = salaryTime - (3 * 86400000);
      const oneDayAfter = salaryTime + (86400000);
      
      // Generate random date within the effective range, avoiding salary date cluster
      let txnDate: Date;
      let attempts = 0;
      do {
        const rangeMs = effectiveEnd.getTime() - effectiveStart.getTime();
        const randomMs = effectiveStart.getTime() + (rng() * rangeMs);
        txnDate = new Date(randomMs);
        attempts++;
      } while (
        attempts < 10 && 
        txnDate.getTime() >= threeDaysBefore && 
        txnDate.getTime() <= oneDayAfter
      ); // Avoid salary date ±3 days to prevent clustering
      
      // Use realistic transactions for SBI, HDFC, IDFC, PNB, and Axis templates, otherwise use generic
      let description: string;
      let reference: string;
      let debitAmount: number;
      
      if (values.template === 'SBI') {
        const txnData = generateRealisticSbiTransaction('debit', rng);
        description = txnData.description;
        reference = txnData.reference;
        debitAmount = txnData.amount;
      } else if (values.template === 'HDFC') {
        const txnData = generateRealisticHdfcTransaction('debit', rng);
        description = txnData.narration;
        reference = txnData.chqRefNo;
        debitAmount = txnData.amount;
      } else if (values.template === 'IDFC') {
        const txnData = generateIdfcRealisticTransaction(txnDate);
        description = txnData.description;
        reference = '';
        debitAmount = Math.abs(txnData.amount); // Ensure positive for debit
      } else if (values.template === 'PNB') {
        description = generatePnbRealisticTransaction('debit');
        reference = String(randomInt(10000000, 99999999, rng));
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'AXIS') {
        description = generateAxisRealisticTransaction('debit', undefined, rng);
        reference = '';
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'BOB') {
        description = generateBobRealisticTransaction('debit', undefined, rng);
        reference = '';
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'ICICI') {
        description = generateIciciRealisticTransaction('debit', undefined, rng);
        reference = '';
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'INDUSIND') {
        description = generateIndusindRealisticTransaction('debit', undefined, rng);
        reference = generateIndusindReference(rng);
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'IOB') {
        description = generateIobRealisticTransaction('debit', undefined, rng);
        reference = generateIobReference(rng);
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'YES') {
        const txnData = generateYesRealisticTransaction('debit', txnDate, rng);
        description = txnData.description;
        reference = txnData.reference;
        debitAmount = txnData.amount;
      } else if (values.template === 'UCO') {
        const txnData = generateUcoRealisticTransaction('debit', txnDate, rng);
        description = txnData.description;
        reference = txnData.reference;
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'KOTAK') {
        const txnData = generateKotakRealisticTransaction('debit', txnDate, rng);
        description = txnData.description;
        reference = txnData.reference;
        debitAmount = randomFloat(200, 8500, 2, rng);
      } else if (values.template === 'CANARA') {
        const txnData = generateCanaraRealisticTransaction('debit', txnDate, rng);
        description = txnData.description || 'Transaction';
        reference = txnData.reference || '';
        debitAmount = randomFloat(200, 8500, 2, rng);
        } else if (values.template === 'UNION') {
          const txnData = generateUnionRealisticTransaction('debit', txnDate, rng);
          description = txnData.description || 'Transaction';
          reference = txnData.reference || '';
          debitAmount = randomFloat(200, 8500, 2, rng);
      } else {
        debitAmount = randomFloat(200, 8500, 2, rng);
        const txnTypes = [
          `UPI/${randomInt(100000000, 999999999, rng)}`,
          `NEFT/${randomInt(10000, 99999, rng)}`,
          `ATM WDL ${randomInt(1000, 9999, rng)}`,
          `POS ${randomInt(100000, 999999, rng)}`,
          `IMPS/${randomInt(100000000, 999999999, rng)}`,
          `Bill Payment ${randomInt(1000, 9999, rng)}`,
          `Online Purchase ${randomInt(1000, 9999, rng)}`
        ];
        description = txnTypes[randomInt(0, txnTypes.length - 1, rng)];
        reference = buildReference('expense', rng);
      }
      
      runningBalance = Math.max(runningBalance - debitAmount, values.startingBalance * 0.3);
      
      transactions.push({
        id: randomId(rng),
        date: txnDate.toISOString(),
        description,
        reference,
        debit: debitAmount,
        credit: 0,
        balance: parseFloat(runningBalance.toFixed(2))
      });
      
      // Add occasional credit transactions (UPI credits, refunds, etc.) for SBI, HDFC, IDFC, PNB, Axis, BOB, ICICI, INDUSIND, IOB, YES, UCO, KOTAK, CANARA, and UNION
      if ((values.template === 'SBI' || values.template === 'HDFC' || values.template === 'IDFC' || values.template === 'PNB' || values.template === 'AXIS' || values.template === 'BOB' || values.template === 'ICICI' || values.template === 'INDUSIND' || values.template === 'IOB' || values.template === 'YES' || values.template === 'UCO' || values.template === 'KOTAK' || values.template === 'CANARA' || values.template === 'UNION') && rng() > 0.7) {
        // Generate credit transaction on a different day in the same month
        const creditOffsetMs = randomInt(-2, 2, rng) * 86400000; // Random offset of -2 to +2 days
        let creditTxnDate = new Date(txnDate.getTime() + creditOffsetMs);
        
        // CRITICAL: Ensure cash deposits are NEVER within 5 days before salary (prevents "Income Structuring" flag)
        const fiveDaysBeforeSalary = date.getTime() - (5 * 86400000);
        const oneDayAfterSalary = date.getTime() + (86400000);
        
        let creditDescription: string;
        let creditReference: string;
        let creditAmount: number;
        
        if (values.template === 'SBI') {
          const creditData = generateRealisticSbiTransaction('credit', rng);
          creditDescription = creditData.description;
          creditReference = creditData.reference;
          creditAmount = creditData.amount;
          
          // If it's a cash deposit, ensure it's far from salary date
          if (creditDescription.includes('CSH DEP')) {
            let safeAttempts = 0;
            while (safeAttempts < 10 && 
                   creditTxnDate.getTime() >= fiveDaysBeforeSalary && 
                   creditTxnDate.getTime() <= oneDayAfterSalary) {
              // Move to earlier in month, far from salary
              const daysToShift = randomInt(10, 20, rng);
              creditTxnDate = new Date(date.getTime() - (daysToShift * 86400000));
              safeAttempts++;
            }
          }
        } else if (values.template === 'HDFC') {
          const creditData = generateRealisticHdfcTransaction('credit', rng);
          creditDescription = creditData.narration;
          creditReference = creditData.chqRefNo;
          creditAmount = creditData.amount;
        } else if (values.template === 'PNB') {
          creditDescription = generatePnbRealisticTransaction('credit');
          creditReference = String(randomInt(10000000, 99999999, rng));
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'AXIS') {
          creditDescription = generateAxisRealisticTransaction('credit', undefined, rng);
          creditReference = '';
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'BOB') {
          creditDescription = generateBobRealisticTransaction('credit', undefined, rng);
          creditReference = '';
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'ICICI') {
          creditDescription = generateIciciRealisticTransaction('credit', undefined, rng);
          creditReference = '';
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'INDUSIND') {
          creditDescription = generateIndusindRealisticTransaction('credit', undefined, rng);
          creditReference = generateIndusindReference(rng);
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'IOB') {
          creditDescription = generateIobRealisticTransaction('credit', undefined, rng);
          creditReference = generateIobReference(rng);
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'YES') {
          const txnData = generateYesRealisticTransaction('credit', creditTxnDate, rng);
          creditDescription = txnData.description;
          creditReference = txnData.reference;
          creditAmount = txnData.amount;
        } else if (values.template === 'UCO') {
          const txnData = generateUcoRealisticTransaction('credit', creditTxnDate, rng);
          creditDescription = txnData.description;
          creditReference = txnData.reference;
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'KOTAK') {
          const txnData = generateKotakRealisticTransaction('credit', creditTxnDate, rng);
          creditDescription = txnData.description;
          creditReference = txnData.reference;
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'CANARA') {
          const txnData = generateCanaraRealisticTransaction('credit', creditTxnDate, rng);
          creditDescription = txnData.description || 'Credit';
          creditReference = txnData.reference || '';
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else if (values.template === 'UNION') {
          const txnData = generateUnionRealisticTransaction('credit', creditTxnDate, rng);
          creditDescription = txnData.description || 'Credit';
          creditReference = txnData.reference || '';
          creditAmount = randomFloat(500, 3000, 2, rng);
        } else {
          // IDFC
          const creditData = generateIdfcRealisticTransaction(creditTxnDate);
          creditDescription = creditData.description;
          creditReference = '';
          creditAmount = -creditData.amount; // IDFC generator returns negative for credits
        }
        
        runningBalance += creditAmount;
        
        transactions.push({
          id: randomId(rng),
          date: creditTxnDate.toISOString(),
          description: creditDescription,
          reference: creditReference,
          debit: 0,
          credit: creditAmount,
          balance: parseFloat(runningBalance.toFixed(2))
        });
      }
    }

    // Add interest credit - must be on weekday, somewhere in the month
    const interest = randomFloat(35, 420, 2, rng);
    runningBalance += interest;
    
    // Generate interest date within the month range
    const salaryYear = date.getFullYear();
    const salaryMonth = date.getMonth();
    const monthStart = new Date(salaryYear, salaryMonth, 1);
    const monthEnd = new Date(salaryYear, salaryMonth + 1, 0);
    
    const effectiveStart = (startDate && salaryYear === startDate.getFullYear() && salaryMonth === startDate.getMonth())
      ? startDate
      : monthStart;
    const effectiveEnd = (endDate && salaryYear === endDate.getFullYear() && salaryMonth === endDate.getMonth())
      ? endDate
      : monthEnd;
    
    const rangeMs = effectiveEnd.getTime() - effectiveStart.getTime();
    const randomMs = effectiveStart.getTime() + (rng() * rangeMs);
    const interestDate = adjustToWeekday(new Date(randomMs));
    
    transactions.push({
      id: randomId(rng),
      date: interestDate.toISOString(),
      description: 'INT. CREDIT',
      reference: buildReference('interest', rng),
      debit: 0,
      credit: interest,
      balance: parseFloat(runningBalance.toFixed(2))
    });
  });

  // CRITICAL: Add time spacing between transactions to prevent "bulk UPI outflow" detection
  // NBFCs flag multiple UPI debits within 1-3 hours as unstable cash control
  const spacedTransactions = transactions.map((txn, idx) => {
    const txnDate = new Date(txn.date);
    
    // Add random hours/minutes to spread transactions throughout the day
    const baseHour = 9 + Math.floor(rng() * 12); // Between 9 AM - 9 PM
    const minutes = Math.floor(rng() * 60);
    const seconds = Math.floor(rng() * 60);
    
    txnDate.setHours(baseHour, minutes, seconds);
    
    return {
      ...txn,
      date: txnDate.toISOString()
    };
  });

  return spacedTransactions;
};

export const buildSalariedStatement = (
  values: SalariedFormValues,
  options: Options
): Statement => {
  const rng = createSeededRng(options.seed);
  const allTransactions = createTable(values, rng);
  
  // Filter transactions to only include those within the statement period
  let filtered = allTransactions;
  if (values.statementStartDate || values.statementEndDate) {
    // Set start time to beginning of start date (00:00:00)
    const startTime = values.statementStartDate 
      ? new Date(values.statementStartDate.getFullYear(), values.statementStartDate.getMonth(), values.statementStartDate.getDate(), 0, 0, 0).getTime()
      : 0;
    
    // Set end time to end of end date (23:59:59.999) to include entire day
    const endTime = values.statementEndDate 
      ? new Date(values.statementEndDate.getFullYear(), values.statementEndDate.getMonth(), values.statementEndDate.getDate(), 23, 59, 59, 999).getTime()
      : Infinity;
    
    filtered = allTransactions.filter(txn => {
      const txnTime = new Date(txn.date).getTime();
      return txnTime >= startTime && txnTime <= endTime;
    });
  }
  
  const ordered = filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let running = values.startingBalance;
  const normalized = ordered.map((txn) => {
    running += txn.credit - txn.debit;
    return {
      ...txn,
      balance: parseFloat(running.toFixed(2))
    };
  });

  // Check for negative balances and fix them
  let hasNegativeBalance = false;
  let minBalance = values.startingBalance;
  
  for (const txn of normalized) {
    if (txn.balance < 0) {
      hasNegativeBalance = true;
      minBalance = Math.min(minBalance, txn.balance);
    }
  }

  // If negative balance found, add adjustment credit transaction at the beginning
  let finalTransactions = normalized;
  if (hasNegativeBalance) {
    const adjustmentAmount = Math.abs(minBalance) + 5000; // Add buffer
    const firstDate = normalized[0]?.date ? new Date(normalized[0].date) : new Date();
    const adjustmentDate = new Date(firstDate);
    adjustmentDate.setDate(adjustmentDate.getDate() - 1);

    const adjustmentTxn: Transaction = {
      id: randomId(rng),
      date: adjustmentDate.toISOString(),
      description: 'Opening Balance Credit\nFunds Transfer',
      reference: buildReference('salary', rng),
      debit: 0,
      credit: adjustmentAmount,
      balance: values.startingBalance + adjustmentAmount
    };

    // Recalculate all balances with adjustment
    running = values.startingBalance + adjustmentAmount;
    finalTransactions = [adjustmentTxn, ...normalized.map((txn) => {
      running += txn.credit - txn.debit;
      return {
        ...txn,
        balance: parseFloat(running.toFixed(2))
      };
    })];
  }

  // If closing balance is specified, adjust the final balance
  let endBalance = finalTransactions[finalTransactions.length - 1]?.balance ?? values.startingBalance;
  
  if (values.closingBalance !== undefined && values.closingBalance > 0) {
    const targetClosing = values.closingBalance;
    const currentClosing = endBalance;
    const difference = targetClosing - currentClosing;
    
    // Add an adjustment transaction near the end to meet target closing balance
    if (Math.abs(difference) > 0.01) {
      const lastTxnDate = finalTransactions[finalTransactions.length - 1]?.date 
        ? new Date(finalTransactions[finalTransactions.length - 1].date)
        : new Date();
      
      const adjustmentTxn: Transaction = {
        id: randomId(rng),
        date: lastTxnDate.toISOString(),
        description: difference > 0 
          ? 'Funds Transfer Credit' 
          : 'Funds Transfer Debit',
        reference: buildReference(difference > 0 ? 'salary' : 'expense', rng),
        debit: difference < 0 ? Math.abs(difference) : 0,
        credit: difference > 0 ? difference : 0,
        balance: targetClosing
      };
      
      finalTransactions.push(adjustmentTxn);
      endBalance = targetClosing;
    }
  }

  // Set statement period dates from user input or fall back to transaction dates
  const fallbackDate = values.statementEndDate ? new Date(values.statementEndDate) : new Date();
  const statementPeriodStart = values.statementStartDate 
    ? new Date(values.statementStartDate).toISOString()
    : (finalTransactions.length > 0 ? finalTransactions[0].date : fallbackDate.toISOString());
  const statementPeriodEnd = values.statementEndDate
    ? new Date(values.statementEndDate).toISOString()
    : (finalTransactions.length > 0 ? finalTransactions[finalTransactions.length - 1].date : fallbackDate.toISOString());

  return {
    id: randomId(rng),
    details: {
      name: values.name,
      accountNumber: values.accountNumber,
      ifsc: values.ifsc,
      bankName: values.bankName,
      startingBalance: values.startingBalance,
      address: values.address,
      city: values.city,
      state: values.state,
      bankBranch: values.bankBranch,
      branchAddress: values.branchAddress,
      phoneNumber: values.phoneNumber,
      email: values.email
    },
    meta: {
      generatedAt: new Date().toISOString(),
      template: values.template,
      statementPeriodStart,
      statementPeriodEnd,
      userType: 'salaried',
      configHash: randomId(rng),
      seed: options.seed
    },
    transactions: finalTransactions.map((txn, idx) => ({
      ...txn,
      balance: idx === finalTransactions.length - 1 ? endBalance : txn.balance
    }))
  };
};
