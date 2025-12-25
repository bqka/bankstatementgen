import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatBobDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd/MM/yyyy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Calculate total pages needed (approximately 30 transactions per page)
const calculateTotalPages = (transactionCount: number): number => {
  return Math.max(1, Math.ceil(transactionCount / 30));
};

// Bank of Baroda logo - Official SVG
const buildBobLogo = () => `
  <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1922 470" width="180" height="44">
    <path fill="#f26522" fill-rule="evenodd" d="m309.5 468.3l-225.4 0.2 1.6-8 164.3-4.7c31.4-1.2 62-2.8 91.6-12.9 60.7-20.3 109.1-61.6 123.3-112.8 15.3-54.8-19.8-108.2-85.9-112.8 56-16.3 103.7-51.8 116.4-97.5 16.5-59.4-13.3-89.3-63.7-100.3 83.8-1.3 149.4 26.9 127.1 107.1-12.7 45.7-61.6 80.5-117.2 95.6 65.3 4.9 101.2 67.1 83.8 121.4-18 56.4-63.5 91.5-124.2 111.8-29.7 10-60.3 11.7-91.7 12.9z"/>
    <path fill="#f26522" fill-rule="evenodd" d="m191.2 439.9l-105.8 5.3c0-2.7 0.1-2.1-0.2-4.7l267.9-79.3 0.9-9.7-273.7 70.8c-0.8-2.6-0.9-1.9-2.1-4.3l286.5-158.7-2.8-7.9-292.8 151.4c-1.7-2.5-1-1.5-3-3.7l340.6-318.1-4.2-8.6-349 315.4c-1.6-1.2-2.7-2-4.4-3.1l249.6-359.4-10.5 0.1-255.5 351.9c-1.4-0.5-3-1-4.5-1.4l148.4-351.1h-9.5l-159.6 348.4c-2 0-6.5 0.1-6.5 0.1l103.3-373.2 193 0.6c91.3-5.2 163.4 19.4 139.7 104.7-12.7 45.6-60.5 81.1-116.1 96.3l-0.4 1.2c66.1 4.6 103.4 57.9 88.1 112.7-14.2 51.1-65.1 91.1-125.8 111.4-29.6 10-60.2 11.7-91.6 12.9z"/>
  </svg>
`;

// Render a single page of transactions
const renderBobPage = (
  statement: Statement,
  transactions: any[],
  pageNumber: number,
  totalPages: number,
  isFirstPage: boolean = false
) => {
  const { details } = statement;
  
  const transactionRows = transactions
    .map((txn, index) => {
      const rowBg = index % 2 === 1 ? '#fff5f0' : '#ffffff';
      return `
      <tr style="background: ${rowBg};">
        <td style="padding: 2px 3px; border: none; font-size: 7px; white-space: nowrap;">${formatBobDate(txn.date)}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; white-space: nowrap;">${formatBobDate(txn.date)}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; white-space: pre-line; word-break: break-word;">${txn.description}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; text-align: center;"></td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; text-align: center;">${txn.debit > 0 ? 'WITHDRAW' : 'DEPOSIT'}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; text-align: right;">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; text-align: right;">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
        <td style="padding: 2px 3px; border: none; font-size: 7px; text-align: right; white-space: nowrap;">${formatAmount(txn.balance)}Cr</td>
      </tr>`;
    }).join('');

  return `
    <div class="page">
      <!-- Logo on right side -->
      <div style="text-align: right; margin-bottom: 10px;">
        ${buildBobLogo()}
      </div>
      
      ${isFirstPage ? `
      <!-- Account Holder and Address (First Page Only) -->
      <div style="display: flex; justify-content: space-between; font-size: 8px; margin-bottom: 10px;">
        <div style="flex: 1;">
          <div><strong>Main Account Holder Name :</strong> ${details.name.toUpperCase()}</div>
        </div>
        <div style="text-align: right;">
          <div><strong>Address :</strong></div>
          ${details.address ? details.address.toUpperCase().split('\n').map(line => `<div>${line}</div>`).join('') : '<div>KETAN GOKALE - BHIKLU</div><div>ICSE SCHOOL</div><div>DIST : PUNE</div><div>MAHARASHTRA</div><div>INDIA</div>'}
        </div>
      </div>
      
      <!-- Customer Details Table (First Page Only) -->
      <table style="width: 100%; border-collapse: collapse; font-size: 7.5px; margin-bottom: 10px;">
        <tr>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0; width: 15%;"><strong>Customer Id:</strong></td>
          <td style="border: 1px solid #000; padding: 3px; width: 35%;">GDA003246</td>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0; width: 15%;"><strong>Account No:</strong></td>
          <td style="border: 1px solid #000; padding: 3px; width: 35%;">${details.accountNumber}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0;"><strong>Branch Name:</strong></td>
          <td style="border: 1px solid #000; padding: 3px;">BAREILI, MP</td>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0;"><strong>MICR Code:</strong></td>
          <td style="border: 1px solid #000; padding: 3px;">464012501</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0;"><strong>IFSC Code:</strong></td>
          <td style="border: 1px solid #000; padding: 3px;">BARB0BAREILI</td>
          <td style="border: 1px solid #000; padding: 3px; background: #f0f0f0;"><strong>Nominee Reg:</strong></td>
          <td style="border: 1px solid #000; padding: 3px;">01</td>
        </tr>
      </table>
      
      <div style="font-size: 8px; margin-bottom: 8px;">
        <strong>Your Account Statement as on ${formatBobDate(new Date())}</strong>
      </div>
      
      <div style="font-size: 7.5px; margin-bottom: 8px;">
        <strong>Statement of transactions in Savings Account ${details.accountNumber} in INR for the period 01/03/2024 to 11/09/2025</strong>
      </div>
      ` : ''}
      
      <!-- Orange Header Bar -->
      <div style="background: #f26522; color: white; padding: 4px 8px; font-size: 8px; font-weight: bold; margin-bottom: 3px; display: flex; justify-content: space-between;">
        <div>${details.name.toUpperCase()}</div>
        <div>Savings Account - ${details.accountNumber}</div>
      </div>
      
      <!-- Transaction Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <thead>
          <tr style="background: #f26522; color: white;">
            <th style="padding: 3px 2px; text-align: left; font-weight: bold; font-size: 7px; white-space: nowrap;">TRAN DATE</th>
            <th style="padding: 3px 2px; text-align: left; font-weight: bold; font-size: 7px; white-space: nowrap;">VALUE DATE</th>
            <th style="padding: 3px 2px; text-align: left; font-weight: bold; font-size: 7px;">NARRATION</th>
            <th style="padding: 3px 2px; text-align: center; font-weight: bold; font-size: 7px; white-space: nowrap;">CHQ.NO</th>
            <th style="padding: 3px 2px; text-align: center; font-weight: bold; font-size: 7px; white-space: nowrap;">MODE</th>
            <th style="padding: 3px 2px; text-align: right; font-weight: bold; font-size: 7px; white-space: nowrap;">WITHDRAWAL(DR)</th>
            <th style="padding: 3px 2px; text-align: right; font-weight: bold; font-size: 7px; white-space: nowrap;">DEPOSIT(CR)</th>
            <th style="padding: 3px 2px; text-align: right; font-weight: bold; font-size: 7px; white-space: nowrap;">BALANCE(INR)</th>
          </tr>
        </thead>
        <tbody>
          ${transactionRows}
        </tbody>
      </table>
      
      <!-- Page Number -->
      <div style="text-align: right; margin-top: 10px; font-size: 8px;">
        <strong>Page ${pageNumber} of ${totalPages}</strong>
      </div>
      
      <!-- Contact Info -->
      <div style="margin-top: 8px; font-size: 6.5px; text-align: center; color: #666;">
        <div>${formatBobDate(new Date())} 13:53 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Contact-Us@18005700</div>
        <div style="margin-top: 2px; font-style: italic;">*This is system generated statement. No signature is required</div>
      </div>
    </div>
  `;
};

export const renderBobTemplate = (statement: Statement) => {
  const { transactions } = statement;
  const totalPages = calculateTotalPages(transactions.length);
  const transactionsPerPage = 30;
  
  let pagesHtml = '';
  
  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * transactionsPerPage;
    const endIndex = Math.min(startIndex + transactionsPerPage, transactions.length);
    const pageTransactions = transactions.slice(startIndex, endIndex);
    
    pagesHtml += renderBobPage(
      statement,
      pageTransactions,
      i + 1,
      totalPages,
      i === 0
    );
  }

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Bank of Baroda - Account Statement</title>
      <style>
        @page { 
          margin: 0.7cm; 
          size: A4;
        }
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 8px;
          line-height: 1.3;
          color: #000;
          background: #fff;
        }
        
        .page {
          min-height: 26cm;
          padding: 8px;
          position: relative;
          page-break-after: always;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        table {
          border-collapse: collapse;
        }
        
        td, th {
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
    </body>
  </html>`;
};