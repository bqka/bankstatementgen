import { addDays, addMonths } from 'date-fns';
import { Statement, Transaction } from '@/types/statement';
import { createSeededRng, randomFloat, randomId, randomInt, shuffle } from '@/utils/random';
import { buildReference } from './reference';
import { SelfEmployedFormValues } from './types';
import { generateRealisticSbiTransaction, setSbiUserLocation } from './sbi-realistic-transactions';
import { generateRealisticHdfcTransaction } from './hdfc-realistic-transactions';
import { generateIdfcRealisticTransaction } from './idfc-realistic-transactions';
import { generatePnbRealisticTransaction } from './pnb-realistic-transactions';
import { generateAxisRealisticTransaction } from './axis-realistic-transactions';
import { generateBobRealisticTransaction } from './bob-realistic-transactions';
import { generateIciciRealisticTransaction } from './icici-realistic-transactions';
import { generateIndusindRealisticTransaction, generateIndusindReference } from './indusind-realistic-transactions';
import { generateIobRealisticTransaction, generateIobReference } from './iob-realistic-transactions';
import { generateYesRealisticTransaction, generateYesReference } from './yes-realistic-transactions';
import { generateUcoRealisticTransaction, generateUcoReference } from './uco-realistic-transactions';
import { generateKotakRealisticTransaction, generateKotakReference } from './kotak-realistic-transactions';
import { generateCanaraRealisticTransaction, generateCanaraReference } from './canara-realistic-transactions';
import { generateUnionRealisticTransaction, generateUnionReference } from './union-realistic-transactions';

interface Options {
  seed: number;
}

const MERCHANTS = [
  'ABC Traders',
  'Singh Electronics',
  'Mishra Wholesale',
  'UPI/Verma & Sons',
  'QR Payment Kiran Store',
  'NEFT/Global Enterprises',
  'UPI/Blue Ocean Supplies',
  'IMPS/Cityline Services',
  'QR/Gautam Industries',
  'UPI/Frontier Motors'
];

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

const interestCredit = (balance: number, rng: () => number) => {
  const interest = randomFloat(balance * 0.003, balance * 0.006, 2, rng);
  return Math.max(interest, 25);
};

const ensurePositiveBalance = (transactions: Transaction[], startingBalance: number) => {
  let running = startingBalance;
  return transactions.map((txn) => {
    running += txn.credit - txn.debit;
    if (running < startingBalance * 0.25) {
      const adjustment = startingBalance * 0.3;
      running += adjustment;
      return {
        ...txn,
        description: `${txn.description} (Adjusted inflow)`,
        credit: txn.credit + adjustment,
        balance: parseFloat(running.toFixed(2))
      };
    }
    return {
      ...txn,
      balance: parseFloat(running.toFixed(2))
    };
  });
};

export const buildSelfEmployedStatement = (
  values: SelfEmployedFormValues,
  options: Options
): Statement => {
  const rng = createSeededRng(options.seed);
  
  // Set user location from form data for location-aware transactions
  if (values.template === 'SBI') {
    setSbiUserLocation(values.city, values.branchAddress);
    // Reset used names to prevent circular transaction patterns
    const { resetUsedNames } = require('./sbi-realistic-transactions');
    resetUsedNames();
  }
  
  // Use custom end date if provided, otherwise default to today
  const endDate = values.statementEndDate ?? new Date();
  
  // Ensure end date is not in the future
  const today = new Date();
  if (endDate > today) {
    endDate.setTime(today.getTime());
  }
  
  // Calculate start date: if custom start date provided, use it; otherwise calculate from period
  let startDate: Date;
  if (values.statementStartDate) {
    startDate = values.statementStartDate;
  } else {
    startDate = addMonths(endDate, -values.periodMonths);
  }
  
  // Use custom transaction count or default to realistic range
  const totalTransactions = values.numberOfTransactions || randomInt(100, 300, rng);
  
  // Calculate credit and debit counts (60% credits, 40% debits)
  const creditsCount = Math.ceil(totalTransactions * 0.6);
  const debitsCount = totalTransactions - creditsCount;

  // Distribute turnover across credits
  const turnovers = Array.from({ length: creditsCount }, () => 0);
  let remainingTurnover = values.turnover;

  turnovers.forEach((_, index) => {
    const fraction = randomFloat(0.05, 0.25, 2, rng);
    const amount = parseFloat((values.turnover * fraction).toFixed(2));
    remainingTurnover -= amount;
    turnovers[index] = amount;
  });

  if (remainingTurnover > 0) {
    turnovers[0] += remainingTurnover;
  }

  const transactions: Transaction[] = [];
  let runningBalance = values.startingBalance;

  // Calculate the period in days and ensure dates don't go into future
  const periodInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  shuffle(turnovers, rng).forEach((amount, idx) => {
    // Generate date within the period, ensuring it's not in the future
    const dayOffset = randomInt(3, Math.max(3, periodInDays - 3), rng);
    const date = addDays(startDate, dayOffset);
    
    // Final safety check: never allow future dates
    const txnDate = date > endDate ? new Date(endDate.getTime() - randomInt(1, 5, rng) * 24 * 60 * 60 * 1000) : date;
    
    runningBalance += amount;
    
    // Generate realistic credit transaction for SBI, HDFC, IDFC, PNB, and Axis
    let creditDescription: string;
    let creditReference: string;
    
    if (values.template === 'SBI') {
      const creditData = generateRealisticSbiTransaction('credit', rng);
      creditDescription = creditData.description;
      creditReference = creditData.reference;
    } else if (values.template === 'HDFC') {
      const creditData = generateRealisticHdfcTransaction('credit', rng);
      creditDescription = creditData.narration;
      creditReference = creditData.chqRefNo;
    } else if (values.template === 'IDFC') {
      const creditData = generateIdfcRealisticTransaction(txnDate);
      creditDescription = creditData.description;
      creditReference = '';
      // IDFC generator returns negative for credits, convert to positive
      amount = -creditData.amount;
    } else if (values.template === 'PNB') {
      creditDescription = generatePnbRealisticTransaction('credit');
      creditReference = String(randomInt(10000000, 99999999, rng));
    } else if (values.template === 'AXIS') {
      creditDescription = generateAxisRealisticTransaction('credit', undefined, rng);
      creditReference = '';
    } else if (values.template === 'BOB') {
      creditDescription = generateBobRealisticTransaction('credit', undefined, rng);
      creditReference = '';
    } else if (values.template === 'ICICI') {
      creditDescription = generateIciciRealisticTransaction('credit', undefined, rng);
      creditReference = '';
    } else if (values.template === 'INDUSIND') {
      creditDescription = generateIndusindRealisticTransaction('credit', undefined, rng);
      creditReference = generateIndusindReference(rng);
    } else if (values.template === 'IOB') {
      creditDescription = generateIobRealisticTransaction('credit', undefined, rng);
      creditReference = generateIobReference(rng);
    } else if (values.template === 'YES') {
      const creditData = generateYesRealisticTransaction('credit', txnDate, rng);
      creditDescription = creditData.description;
      creditReference = generateYesReference(txnDate, rng);
    } else if (values.template === 'UCO') {
      const creditData = generateUcoRealisticTransaction('credit', txnDate, rng);
      creditDescription = creditData.description;
      creditReference = generateUcoReference(txnDate, rng);
    } else if (values.template === 'KOTAK') {
      const creditData = generateKotakRealisticTransaction('credit', txnDate, rng);
      creditDescription = creditData.description || 'Business Credit';
      creditReference = generateKotakReference(txnDate, rng);
    } else if (values.template === 'CANARA') {
      const creditData = generateCanaraRealisticTransaction('credit', txnDate, rng);
      creditDescription = creditData.description || 'Business Credit';
      creditReference = generateCanaraReference(txnDate, rng);
    } else if (values.template === 'UNION') {
      const creditData = generateUnionRealisticTransaction('credit', txnDate, rng);
      creditDescription = creditData.description || 'Business Credit';
      creditReference = generateUnionReference(txnDate, rng);
    } else {
      creditDescription = shuffle(MERCHANTS, rng)[0];
      creditReference = buildReference('credit', rng);
    }
    
    transactions.push({
      id: randomId(rng),
      date: txnDate.toISOString(),
      description: creditDescription,
      reference: creditReference,
      debit: 0,
      credit: amount,
      balance: parseFloat(runningBalance.toFixed(2))
    });

    if (idx < debitsCount) {
      let debitAmount = randomFloat(amount * 0.4, amount * 0.9, 2, rng);
      
      // Generate realistic debit transaction for SBI, HDFC, IDFC, PNB, and Axis
      let debitDescription: string;
      let debitReference: string;
      
      if (values.template === 'SBI') {
        const debitData = generateRealisticSbiTransaction('debit', rng);
        debitDescription = debitData.description;
        debitReference = debitData.reference;
      } else if (values.template === 'HDFC') {
        const debitData = generateRealisticHdfcTransaction('debit', rng);
        debitDescription = debitData.narration;
        debitReference = debitData.chqRefNo;
      } else if (values.template === 'IDFC') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateIdfcRealisticTransaction(actualDebitDate);
        debitDescription = debitData.description;
        debitReference = '';
        debitAmount = Math.abs(debitData.amount); // Ensure positive for debit
      } else if (values.template === 'PNB') {
        debitDescription = generatePnbRealisticTransaction('debit');
        debitReference = String(randomInt(10000000, 99999999, rng));
      } else if (values.template === 'AXIS') {
        debitDescription = generateAxisRealisticTransaction('debit', undefined, rng);
        debitReference = '';
      } else if (values.template === 'BOB') {
        debitDescription = generateBobRealisticTransaction('debit', undefined, rng);
        debitReference = '';
      } else if (values.template === 'ICICI') {
        debitDescription = generateIciciRealisticTransaction('debit', undefined, rng);
        debitReference = '';
      } else if (values.template === 'INDUSIND') {
        debitDescription = generateIndusindRealisticTransaction('debit', undefined, rng);
        debitReference = generateIndusindReference(rng);
      } else if (values.template === 'IOB') {
        debitDescription = generateIobRealisticTransaction('debit', undefined, rng);
        debitReference = generateIobReference(rng);
      } else if (values.template === 'YES') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateYesRealisticTransaction('debit', actualDebitDate, rng);
        debitDescription = debitData.description;
        debitReference = generateYesReference(actualDebitDate, rng);
      } else if (values.template === 'UCO') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateUcoRealisticTransaction('debit', actualDebitDate, rng);
        debitDescription = debitData.description;
        debitReference = generateUcoReference(actualDebitDate, rng);
      } else if (values.template === 'KOTAK') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateKotakRealisticTransaction('debit', actualDebitDate, rng);
        debitDescription = debitData.description;
        debitReference = generateKotakReference(actualDebitDate, rng);
      } else if (values.template === 'CANARA') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateCanaraRealisticTransaction('debit', actualDebitDate, rng);
        debitDescription = debitData.description || 'Business Expense';
        debitReference = generateCanaraReference(actualDebitDate, rng);
      } else if (values.template === 'UNION') {
        const debitTxnDate = addDays(txnDate, randomInt(1, 4, rng));
        const actualDebitDate = debitTxnDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : debitTxnDate;
        const debitData = generateUnionRealisticTransaction('debit', actualDebitDate, rng);
        debitDescription = debitData.description || 'Business Expense';
        debitReference = generateUnionReference(actualDebitDate, rng);
      } else {
        debitDescription = `Vendor payment ${randomInt(101, 999, rng)}`;
        debitReference = buildReference('debit', rng);
      }
      
      runningBalance -= debitAmount;
      
      // Ensure debit date is also not in future
      const finalDebitDate = addDays(txnDate, randomInt(1, 4, rng));
      const safeDebitDate = finalDebitDate > endDate ? new Date(endDate.getTime() - randomInt(0, 2, rng) * 24 * 60 * 60 * 1000) : finalDebitDate;
      
      transactions.push({
        id: randomId(rng),
        date: safeDebitDate.toISOString(),
        description: debitDescription,
        reference: debitReference,
        debit: debitAmount,
        credit: 0,
        balance: parseFloat(runningBalance.toFixed(2))
      });
    }

    const interest = interestCredit(runningBalance, rng);
    runningBalance += interest;
    const interestDate = adjustToWeekday(addDays(txnDate, randomInt(2, 6, rng)));
    // Ensure interest date doesn't exceed end date
    const safeInterestDate = interestDate > endDate ? adjustToWeekday(new Date(endDate.getTime() - randomInt(1, 3, rng) * 24 * 60 * 60 * 1000)) : interestDate;
    transactions.push({
      id: randomId(rng),
      date: safeInterestDate.toISOString(),
      description: 'INT.CREDIT',
      reference: buildReference('interest', rng),
      debit: 0,
      credit: interest,
      balance: parseFloat(runningBalance.toFixed(2))
    });
  });

  const ordered = transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const positiveBalance = ensurePositiveBalance(ordered, values.startingBalance);

  // Apply closing balance adjustment if specified
  let finalTransactions = positiveBalance;
  if (values.closingBalance !== undefined && positiveBalance.length > 0) {
    const currentClosing = positiveBalance[positiveBalance.length - 1].balance;
    const targetClosing = values.closingBalance;
    const difference = targetClosing - currentClosing;

    if (Math.abs(difference) > 1) {
      // Add adjustment transaction
      const lastTxn = positiveBalance[positiveBalance.length - 1];
      const adjustmentDate = addDays(new Date(lastTxn.date), 1);
      
      const adjustmentTxn: Transaction = {
        id: randomId(rng),
        date: adjustmentDate.toISOString(),
        description: difference > 0 ? 'Balance adjustment credit' : 'Balance adjustment debit',
        reference: buildReference(difference > 0 ? 'credit' : 'debit', rng),
        debit: difference < 0 ? Math.abs(difference) : 0,
        credit: difference > 0 ? difference : 0,
        balance: targetClosing
      };

      finalTransactions = [...positiveBalance, adjustmentTxn];
    }
  }

  // Set statement period dates from actual transactions
  const statementPeriodStart = finalTransactions.length > 0 ? finalTransactions[0].date : startDate.toISOString();
  const statementPeriodEnd = finalTransactions.length > 0 ? finalTransactions[finalTransactions.length - 1].date : endDate.toISOString();

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
      userType: 'selfEmployed',
      configHash: randomId(rng),
      seed: options.seed
    },
    transactions: finalTransactions
  };
};
