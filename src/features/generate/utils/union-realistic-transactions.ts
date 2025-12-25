import { Transaction } from '@/types/statement';


// Union Bank of India transaction patterns
// Reference formats: {12-digits} (70%), UTR{16-digits} (30%)
// Transaction mix: 80% UPI debit, 77% UPI credit
// Bank handle: @unionbank
// Popular apps: PhonePe (38%), Google Pay (33%), Paytm (16%)

export const generateUnionReference = (date: Date, rng: () => number): string => {
  const formats = [
    { type: '12digit', weight: 70 },
    { type: 'UTR', weight: 30 },
  ];

  const totalWeight = formats.reduce((sum, f) => sum + f.weight, 0);
  const random = rng() * totalWeight;
  let cumWeight = 0;

  for (const format of formats) {
    cumWeight += format.weight;
    if (random < cumWeight) {
      if (format.type === 'UTR') {
        const num = Math.floor(rng() * 1e16).toString().padStart(16, '0');
        return `UTR${num}`;
      } else {
        return Math.floor(rng() * 1e12).toString().padStart(12, '0');
      }
    }
  }

  return Math.floor(rng() * 1e12).toString().padStart(12, '0');
};

export const generateUnionUpiDebit = (rng: () => number): string => {
  const categories = [
    { type: 'qcode', weight: 33 },
    { type: 'paytm_qr', weight: 21 },
    { type: 'business', weight: 23 },
    { type: 'p2p', weight: 15 },
    { type: 'vyapar', weight: 8 },
  ];

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
  const random = rng() * totalWeight;
  let cumWeight = 0;

  for (const category of categories) {
    cumWeight += category.weight;
    if (random < cumWeight) {
      if (category.type === 'qcode') {
        const businesses = [
          'ZOMATO', 'SWIGGY', 'AMAZON PAY', 'FLIPKART', 'MYNTRA',
          'BIG BAZAAR', 'RELIANCE FRESH', 'DMART', 'MORE SUPERMARKET',
          'STAR BAZAAR', 'MOTHER DAIRY', 'AMUL', 'UBER INDIA',
          'OLA CABS', 'MEDPLUS', 'APOLLO PHARMACY', 'NETMEDS'
        ];
        const business = businesses[Math.floor(rng() * businesses.length)];
        const qrId = Math.floor(rng() * 1e6).toString().padStart(6, '0');
        return `Q${qrId}@paytm`;
      } else if (category.type === 'paytm_qr') {
        const merchants = [
          'KIRANA STORE', 'GENERAL STORE', 'MEDICAL STORE', 'BAKERY',
          'TEA STALL', 'PAN SHOP', 'VEGETABLE VENDOR', 'FRUIT SELLER',
          'MILK BOOTH', 'STATIONERY', 'MOBILE RECHARGE', 'XEROX SHOP'
        ];
        const merchant = merchants[Math.floor(rng() * merchants.length)];
        const qrId = Math.floor(rng() * 1e8).toString().padStart(8, '0');
        return `paytmqr${qrId}@paytm`;
      } else if (category.type === 'business') {
        const businesses = [
          'amazon.payments', 'flipkart.payments', 'myntra.shopping',
          'swiggy.food', 'zomato.dining', 'bookmyshow.tickets',
          'makemytrip.travel', 'redbus.tickets', 'bigbasket.grocery',
          'grofers.fresh', 'dunzo.delivery', 'urbancompany.services',
          'practo.health', 'lenskart.eyewear', 'nykaa.beauty'
        ];
        const handles = ['@axisbank', '@icici', '@hdfcbank', '@paytm', '@ybl', '@unionbank'];
        const business = businesses[Math.floor(rng() * businesses.length)];
        const handle = handles[Math.floor(rng() * handles.length)];
        return `${business}${handle}`;
      } else if (category.type === 'p2p') {
        const names = [
          'rajesh.kumar', 'amit.sharma', 'priya.singh', 'suresh.patel',
          'anjali.verma', 'vikram.reddy', 'neha.gupta', 'rahul.jain',
          'pooja.shah', 'manoj.yadav', 'deepak.nair', 'kavita.iyer',
          'sandeep.menon', 'ritu.agarwal', 'arun.pillai'
        ];
        const handles = ['@ybl', '@paytm', '@okaxis', '@okicici', '@ibl', '@unionbank', '@upi'];
        const name = names[Math.floor(rng() * names.length)];
        const handle = handles[Math.floor(rng() * handles.length)];
        return `${name}${handle}`;
      } else {
        const businesses = [
          'ramelectronics', 'jaiopticals', 'shrimedical', 'omkarhardware',
          'laxmitextiles', 'ganeshjewellers', 'sairamstores', 'balajifootwear',
          'vishwafurniture', 'krishnagarments', 'mahalaxmisarees', 'shivautomobiles'
        ];
        const business = businesses[Math.floor(rng() * businesses.length)];
        return `${business}.vyapar@icici`;
      }
    }
  }

  return 'merchant@paytm';
};

export const generateUnionUpiCredit = (rng: () => number): string => {
  const categories = [
    { type: 'p2p', weight: 73 },
    { type: 'business', weight: 16 },
    { type: 'vyapar', weight: 11 },
  ];

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
  const random = rng() * totalWeight;
  let cumWeight = 0;

  for (const category of categories) {
    cumWeight += category.weight;
    if (random < cumWeight) {
      if (category.type === 'p2p') {
        const names = [
          'mukesh.aggarwal', 'sunita.kapoor', 'vikas.malhotra', 'nisha.bansal',
          'ashok.saxena', 'rekha.chopra', 'rajiv.khanna', 'anita.arora',
          'sanjay.bhatia', 'meena.sethi', 'gopal.taneja', 'usha.sehgal',
          'pankaj.goel', 'vandana.tiwari', 'harish.mehta'
        ];
        const handles = ['@ybl', '@paytm', '@okaxis', '@okicici', '@ibl', '@unionbank', '@upi'];
        const name = names[Math.floor(rng() * names.length)];
        const handle = handles[Math.floor(rng() * handles.length)];
        return `${name}${handle}`;
      } else if (category.type === 'business') {
        const businesses = [
          'freelance.payment', 'consulting.fees', 'tuition.income',
          'rental.collection', 'commission.earned', 'refund.zomato',
          'refund.amazon', 'cashback.paytm', 'reward.googlepay'
        ];
        const handles = ['@axisbank', '@icici', '@hdfcbank', '@paytm', '@ybl'];
        const business = businesses[Math.floor(rng() * businesses.length)];
        const handle = handles[Math.floor(rng() * handles.length)];
        return `${business}${handle}`;
      } else {
        const businesses = [
          'tradersassociation', 'merchantguild', 'shopkeeperunion',
          'retailernetwork', 'vendorplatform', 'businesshub'
        ];
        const business = businesses[Math.floor(rng() * businesses.length)];
        return `${business}.vyapar@icici`;
      }
    }
  }

  return 'sender@ybl';
};

export const generateUnionSalaryCredit = (employer: string, rng: () => number): string => {
  const formats = [
    { type: 'NEFT', weight: 45 },
    { type: 'IMPS', weight: 30 },
    { type: 'Direct', weight: 25 },
  ];

  const totalWeight = formats.reduce((sum, f) => sum + f.weight, 0);
  const random = rng() * totalWeight;
  let cumWeight = 0;

  for (const format of formats) {
    cumWeight += format.weight;
    if (random < cumWeight) {
      if (format.type === 'NEFT') {
        const ref = Math.floor(rng() * 1e12).toString().padStart(12, '0');
        return `NEFT-${employer.toUpperCase()}-${ref}-SAL`;
      } else if (format.type === 'IMPS') {
        const ref = Math.floor(rng() * 1e12).toString().padStart(12, '0');
        return `IMPS-${employer.toUpperCase()}-${ref}`;
      } else {
        return `SALARY CREDIT-${employer.toUpperCase()}`;
      }
    }
  }

  return `SALARY-${employer.toUpperCase()}`;
};

export const generateUnionRealisticTransaction = (
  type: 'debit' | 'credit',
  date: Date,
  rng: () => number
): Partial<Transaction> => {
  const ref = generateUnionReference(date, rng);
  const txnId = Math.floor(rng() * 1e9).toString().padStart(9, '0');

  if (type === 'debit') {
    const upiPercentage = 80;
    const isUPI = rng() * 100 < upiPercentage;

    if (isUPI) {
      const recipient = generateUnionUpiDebit(rng);
      const phoneNum = '91' + Math.floor(rng() * 1e10).toString().padStart(10, '0');

      const apps = [
        { name: 'PhonePe', weight: 38 },
        { name: 'Google Pay', weight: 33 },
        { name: 'Paytm', weight: 16 },
        { name: 'Amazon Pay', weight: 8 },
        { name: 'BHIM', weight: 5 },
      ];

      const totalWeight = apps.reduce((sum, app) => sum + app.weight, 0);
      const random = rng() * totalWeight;
      let cumWeight = 0;
      let appName = 'PhonePe';

      for (const app of apps) {
        cumWeight += app.weight;
        if (random < cumWeight) {
          appName = app.name;
          break;
        }
      }

      const description = `UPI/${ref}/From:${phoneNum}@unionbank/To:${recipient}/Payment from ${appName}`;

      return {
        reference: ref,
        description,
      };
    } else {
      const otherTypes = [
        { type: 'IMPS', weight: 35 },
        { type: 'NEFT', weight: 30 },
        { type: 'ATM', weight: 20 },
        { type: 'CARD', weight: 15 },
      ];

      const totalWeight = otherTypes.reduce((sum, t) => sum + t.weight, 0);
      const random = rng() * totalWeight;
      let cumWeight = 0;

      for (const txnType of otherTypes) {
        cumWeight += txnType.weight;
        if (random < cumWeight) {
          if (txnType.type === 'IMPS') {
            const beneficiary = ['UTILITY BILL', 'INSURANCE PREMIUM', 'LOAN EMI', 'CREDIT CARD'][
              Math.floor(rng() * 4)
            ];
            return {
              reference: ref,
              description: `IMPS-${beneficiary}-${ref}`,
            };
          } else if (txnType.type === 'NEFT') {
            const beneficiary = ['MUTUAL FUND', 'INVESTMENT', 'INSURANCE', 'LOAN REPAYMENT'][
              Math.floor(rng() * 4)
            ];
            return {
              reference: ref,
              description: `NEFT-${beneficiary}-${ref}`,
            };
          } else if (txnType.type === 'ATM') {
            const locations = ['DELHI', 'MUMBAI', 'BANGALORE', 'CHENNAI', 'HYDERABAD', 'PUNE', 'KOLKATA'];
            const location = locations[Math.floor(rng() * locations.length)];
            return {
              reference: ref,
              description: `ATM WITHDRAWAL ${location} ${txnId}`,
            };
          } else {
            const merchants = ['AMAZON', 'FLIPKART', 'SWIGGY', 'ZOMATO', 'UBER'];
            const merchant = merchants[Math.floor(rng() * merchants.length)];
            return {
              reference: ref,
              description: `CARD POS ${merchant} ${txnId}`,
            };
          }
        }
      }
    }
  } else {
    // Credit transaction
    const upiPercentage = 77;
    const isUPI = rng() * 100 < upiPercentage;

    if (isUPI) {
      const sender = generateUnionUpiCredit(rng);
      const phoneNum = '91' + Math.floor(rng() * 1e10).toString().padStart(10, '0');

      const apps = [
        { name: 'PhonePe', weight: 38 },
        { name: 'Google Pay', weight: 33 },
        { name: 'Paytm', weight: 16 },
        { name: 'Amazon Pay', weight: 8 },
        { name: 'BHIM', weight: 5 },
      ];

      const totalWeight = apps.reduce((sum, app) => sum + app.weight, 0);
      const random = rng() * totalWeight;
      let cumWeight = 0;
      let appName = 'PhonePe';

      for (const app of apps) {
        cumWeight += app.weight;
        if (random < cumWeight) {
          appName = app.name;
          break;
        }
      }

      const description = `UPI/${ref}/From:${sender}/To:${phoneNum}@unionbank/Payment from ${appName}`;

      return {
        reference: ref,
        description,
      };
    } else {
      const otherTypes = [
        { type: 'IMPS', weight: 40 },
        { type: 'NEFT', weight: 35 },
        { type: 'CASH', weight: 15 },
        { type: 'CHEQUE', weight: 10 },
      ];

      const totalWeight = otherTypes.reduce((sum, t) => sum + t.weight, 0);
      const random = rng() * totalWeight;
      let cumWeight = 0;

      for (const txnType of otherTypes) {
        cumWeight += txnType.weight;
        if (random < cumWeight) {
          if (txnType.type === 'IMPS') {
            const sources = ['CLIENT PAYMENT', 'REFUND', 'DIVIDEND', 'INTEREST'][
              Math.floor(rng() * 4)
            ];
            return {
              reference: ref,
              description: `IMPS-${sources}-${ref}`,
            };
          } else if (txnType.type === 'NEFT') {
            const sources = ['BUSINESS INCOME', 'RENTAL INCOME', 'COMMISSION', 'BONUS'][
              Math.floor(rng() * 4)
            ];
            return {
              reference: ref,
              description: `NEFT-${sources}-${ref}`,
            };
          } else if (txnType.type === 'CASH') {
            return {
              reference: ref,
              description: `CASH DEPOSIT BR:${Math.floor(rng() * 9999).toString().padStart(4, '0')}`,
            };
          } else {
            const chequeNum = Math.floor(rng() * 1e6).toString().padStart(6, '0');
            return {
              reference: ref,
              description: `CHEQUE DEPOSIT CHQ:${chequeNum}`,
            };
          }
        }
      }
    }
  }

  return {
    reference: ref,
    description: `TXN-${ref}`,
  };
};

