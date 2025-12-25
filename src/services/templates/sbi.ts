import { Statement } from '@/types/statement';
import { format } from 'date-fns';
import { randomFloat } from '@/utils/random';

const formatSbiDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, "d MMM yyyy"); // Match real format: "3 Aug 2025"
};

const formatSbiDateTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, "d MMM yyyy"); // Full date for both columns
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// SBI Logo - Official SVG embedded
const buildSbiLogo = () => `
  <div style="display: inline-block; margin-bottom: 10px;">
    <svg width="180" height="45" viewBox="0 0 708 248" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1.3333333,0,0,-1.3333333,0,248)">
        <g transform="scale(0.1)">
          <!-- Cyan circle with keyhole -->
          <path style="fill:#00b6f0;fill-opacity:1;fill-rule:evenodd;stroke:none" 
                d="m 1828.67,939.117 c 0,504.193 -408.71,912.923 -912.897,912.923 C 411.578,1852.04 2.87891,1443.31 2.87891,939.117 2.87891,454.031 377.199,56.793 854.656,26.2266 V 732.859 c -87.84,26.735 -152.785,106.957 -152.785,206.258 0,114.613 95.492,210.093 213.902,210.093 118.407,0 213.907,-95.48 213.907,-210.093 0,-99.301 -64.92,-179.523 -156.606,-206.258 V 26.2266 C 1450.54,56.793 1828.67,454.031 1828.67,939.117 v 0" />
          <!-- Letter S -->
          <path style="fill:#271e79;fill-opacity:1;fill-rule:evenodd;stroke:none" 
                d="m 3122.2,1319.71 c 55.32,110.65 110.65,221.31 165.98,331.96 -314.21,293.78 -911.11,280.81 -1105.71,-139.73 -51.86,-112.1 -50.05,-236.33 -0.58,-366.9 23.89,-63.02 66.85,-141.6 135.09,-197.915 34.87,-28.789 168.84,-95.141 277.15,-144.238 101.33,-45.938 240.82,-78.914 304.86,-169.477 73.19,-103.488 27.99,-231.277 -141.77,-254.547 -95.13,-13.031 -236.73,26.516 -447.76,196.801 -74.41,-97.305 -148.81,-194.598 -223.22,-291.898 709.83,-619.028 1365.05,-77.051 1211.52,404.66 -39,122.363 -119.24,216.461 -218.64,288.269 -153.75,111.035 -314.27,141.135 -421.43,187.845 -200.78,87.52 -172.45,333.88 105.98,318.84 176.21,-9.51 232.82,-59.83 358.53,-163.67" />
          <!-- Letter B -->
          <path style="fill:#271e79;fill-opacity:1;fill-rule:evenodd;stroke:none" 
                d="m 3481.97,1852.76 h 688.25 c 231.38,0 502.67,-201.05 502.67,-441.07 0,-55.46 3.83,-97.03 0.03,-161.43 -7.52,-127.37 -125.05,-270.338 -200.79,-270.338 117.87,0 235.63,-168.836 264.54,-285.707 C 4806.9,410.371 4657.77,6.13672 4170.22,6.13672 h -688.25 z m 369.14,-336.97 h 270.44 c 101.52,0 184.58,-86.16 184.58,-191.49 v -27.43 c 0,-90.23 -71.16,-164.05 -158.13,-164.05 H 4036.39 V 791.395 h 130.22 c 117.66,0 213.92,-99.86 213.92,-221.915 v -0.011 c 0,-122.055 -96.26,-221.914 -213.92,-221.914 h -315.5 c 0,389.414 0,778.825 0,1168.235" />
          <!-- Letter I -->
          <path style="fill:#271e79;fill-opacity:1;fill-rule:evenodd;stroke:none" 
                d="m 4920.68,1852.76 h 389.2 V 6.14063 h -389.2 V 1852.76" />
        </g>
      </g>
    </svg>
  </div>
`;

export const renderSbiTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);
  
  // FIX: Statement date must be within period (between start and end date)
  // Use end date as statement generation date if meta.generatedAt is after end date
  const statementDate = new Date(meta.generatedAt) > new Date(endDate) 
    ? endDate 
    : meta.generatedAt;

  // FIX #1: Ensure balance never goes negative
  // Recalculate balances if any are negative
  let runningBalance = details.startingBalance;
  const validatedTransactions = transactions.map((txn) => {
    runningBalance = runningBalance + txn.credit - txn.debit;
    
    // If balance would be negative, adjust the transaction
    if (runningBalance < 0) {
      // Add credit to bring balance back to positive
      const adjustment = Math.abs(runningBalance) + randomFloat(1000, 5000, 2, Math.random);
      const adjustedCredit = txn.credit + adjustment;
      runningBalance = runningBalance + adjustment; // Update running balance
      return {
        ...txn,
        credit: adjustedCredit,
        balance: runningBalance
      };
    }
    
    return {
      ...txn,
      balance: runningBalance
    };
  });

  const totalCredit = validatedTransactions.reduce((sum, txn) => sum + txn.credit, 0);
  const totalDebit = validatedTransactions.reduce((sum, txn) => sum + txn.debit, 0);
  const closingBalance = validatedTransactions.length
    ? validatedTransactions[validatedTransactions.length - 1].balance
    : details.startingBalance;

  // FIX #3: Generate numeric-only CIF number
  const generateNumericCif = () => {
    const timestamp = Date.now().toString();
    return timestamp.substring(timestamp.length - 11); // Last 11 digits
  };

  const transactionRows = validatedTransactions
    .map(
      (txn) => {
        // Format reference: Keep line breaks for "TRANSFER FROM" but show "TRANSFER TO" as single line
        let formattedReference = txn.reference || '';
        if (formattedReference) {
          if (formattedReference.includes('FROM')) {
            // Keep line breaks for TRANSFER FROM
            formattedReference = formattedReference.replace(/\n/g, '<br/>');
          } else if (formattedReference.includes('TO')) {
            // Replace line breaks with space for TRANSFER TO (single line)
            formattedReference = formattedReference.replace(/\n/g, ' ');
          } else {
            // For other references, keep line breaks
            formattedReference = formattedReference.replace(/\n/g, '<br/>');
          }
        }
        
        return `
      <tr>
        <td class="date-cell">${formatSbiDateTime(txn.date)}</td>
        <td class="date-cell">${formatSbiDateTime(txn.date)}</td>
        <td class="desc-cell">${txn.description.replace(/\n/g, '<br/>')}</td>
        <td class="ref-cell">${formattedReference}</td>
        <td class="amount-cell">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
        <td class="amount-cell">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
        <td class="amount-cell">${formatAmount(Math.abs(txn.balance))}</td>
      </tr>
    `;
      }
    )
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>State Bank of India - Account Statement</title>
      <style>
        /* Page margins matching real SBI statement */
        @page { margin: 1.57cm 0.8cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: Acumin Pro; 
          font-size: 9.2pt;
          line-height: 1.2;
          color: #000;
          background: #fff;
          padding: 12px;
        }

        .logo-container {
          text-align: left;
          margin-bottom: 10px;
        }

        .info-container {
          display: grid;
          grid-template-columns: 155px 10px 1fr;
          gap: 0;
          width: 100%;
          font-size: 9.2pt;
          margin-bottom: 12px;
          line-height: 1.3;
          background: transparent;
          border: none;
          outline: none;
        }
        
        .info-label {
          padding: 2px 8px 2px 0;
          font-weight: normal;
          font-size: 9.2pt;
          grid-column: 1;
        }
        
        .info-colon {
          padding: 2px 4px;
          font-size: 9.2pt;
          grid-column: 2;
        }
        
        .info-value {
          padding: 2px 0;
          font-weight: normal;
          font-size: 9.2pt;
          grid-column: 3;
        }

        .statement-title {
          text-align: left;
          font-size: 12pt;
          font-weight: normal;
          margin: 24px 12px 19px 0;
        }

        /* Table styling to match real SBI statement exactly */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
          font-size: 9.2pt;
          table-layout: fixed;
        }
        
        /* Table headers - compact and precise */
        thead th {
          background: #ffffff;
          border: 1px solid #000;
  
          font-weight: bold;
          font-size: 10pt;
          line-height: 1;
          text-align: left;        /* Horizontal alignment left */
          vertical-align: top;     /* Vertical alignment top */
        }
        
        thead th.left {
          text-align: left;
            padding: 3px 0 3px 2px;
        }
        
        thead th.right {
          text-align: right;
           padding: 3px 3px 0px 0;
        }
        
        /* Table body cells - very compact like real statement */
        tbody tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        tbody td {
          border: 0.95px solid #000;
          padding: 2px 3px;
          vertical-align: top;
          font-size: 9.2pt;
          line-height: 1.0;
        }
        
        /* Date columns - right aligned, compact */
        td.date-cell {
          text-align: right;
          line-height: 1.0;
          font-size: 9.2pt;
      
        }
        
        /* Description - left aligned, slightly smaller */
        td.desc-cell {
          text-align: left;
          font-size: 9.2pt;
          line-height: 0.95;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Reference - left aligned */
        td.ref-cell {
          text-align: left;
          font-size: 9.2pt;
          line-height: 0.95;
          word-wrap: break-word;
        }
        
        /* Amount columns - right aligned */
        td.amount-cell {
          text-align: right;
          font-family: sans-serif;
          font-size: 9.2pt;
          white-space: nowrap;
        }

        .footer {
          margin-top: 15px;
          font-size: 9.2pt;
          text-align: left;
          color: #333;
        }

        .disclaimer {
          margin-top: 12px;
          font-size: 9.2pt;
          line-height: 1.4;
          text-align: justify;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      ${buildSbiLogo()}

      <div class="info-container">
        <div class="info-label">Account Name</div>
        <div class="info-colon">:</div>
        <div class="info-value">${details.name.toUpperCase()}</div>
        
        <div class="info-label">Address</div>
        <div class="info-colon">:</div>
        <div class="info-value">${details.address ? details.address.toUpperCase().replace(/\n/g, '<br/>') : 'CUSTOMER ADDRESS<br/>POST OFFICE<br/>CITY - 123456<br/>MAHARASHTRA'}</div>
        
        <div class="info-label">Date</div>
        <div class="info-colon">:</div>
        <div class="info-value">${formatSbiDate(statementDate)}</div>
        
        <div class="info-label">Account Number</div>
        <div class="info-colon">:</div>
        <div class="info-value">${details.accountNumber}</div>
        
        <div class="info-label">Account Description</div>
        <div class="info-colon">:</div>
        <div class="info-value"> REGULAR SB CHQ-INDIVIDUALS</div>
        
        <div class="info-label">Branch</div>
        <div class="info-colon">:</div>
        <div class="info-value">${details.bankBranch || details.branch || details.bankName || 'BRANCH NAME'}</div>
        
        <div class="info-label">Drawing Power</div>
        <div class="info-colon">:</div>
        <div class="info-value">0.00</div>
        
        <div class="info-label">Interest Rate(% p.a.)</div>
        <div class="info-colon">:</div>
        <div class="info-value">2.5</div>
        
        <div class="info-label">MOD Balance</div>
        <div class="info-colon">:</div>
        <div class="info-value">0.00</div>
        
        <div class="info-label">CIF No.</div>
        <div class="info-colon">:</div>
        <div class="info-value">${generateNumericCif()}</div>
        
        <div class="info-label">CKYCR Number</div>
        <div class="info-colon">:</div>
        <div class="info-value">XXXXXXXXXX${Math.floor(1000 + Math.random() * 9000)}</div>
        
        <div class="info-label">IFS Code<br/>(Indian Financial System)</div>
        <div class="info-colon">:</div>
        <div class="info-value">${details.ifsc}</div>
        
        <div class="info-label">MICR Code<br/>(Magnetic Ink Character Recognition)</div>
        <div class="info-colon">:</div>
        <div class="info-value">431002104</div>
        
        <div class="info-label">Nomination Registered</div>
        <div class="info-colon">:</div>
        <div class="info-value">Yes</div>
        
        <div class="info-label">Balance as on ${formatSbiDate(startDate)}</div>
        <div class="info-colon">:</div>
        <div class="info-value">${formatAmount(details.startingBalance)}</div>
      </div>

      <div class="statement-title">
        Account Statement from ${formatSbiDate(startDate)} to ${formatSbiDate(endDate)}
      </div>

      <table>
        <thead>
          <tr>
            <th class="left" style="width: 11%;">Txn Date</th>
            <th class="left" style="width: 11%;">Value<br/>Date</th>
            <th class="left" style="width: 28%;">Description</th>
            <th class="left" style="width: 18%;">Ref No./Cheque<br/>No.</th>
            <th class="right" style="width: 13%;">Debit</th>
            <th class="right" style="width: 14%;">Credit</th>
            <th class="right" style="width: 18%;">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${transactionRows}
        </tbody>
      </table>

      <div class="disclaimer">
        &nbsp;&nbsp;&nbsp;&nbsp;Please do not share your ATM, Debit/Credit card number, PIN (Personal Identification Number) and OTP (One Time Password) with anyone over mail, SMS, phone call or any other media. Bank never asks for such information.
      </div>

      <div class="footer">
        &nbsp;&nbsp;**This is a computer generated statement and does not require a signature
      </div>
    </body>
  </html>`;
};

export default renderSbiTemplate;