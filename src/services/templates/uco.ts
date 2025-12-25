import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatUcoDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd-MMM-yyyy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// UCO Bank logo - Official SVG
const buildUcoLogo = () => `
  <div style="background: linear-gradient(to bottom, #FFD700 0%, #FFD700 60%, #0044AA 60%, #0044AA 100%); padding: 8px 16px; text-align: center; border-radius: 4px; display: inline-block; min-width: 320px;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
      <div style="font-family: 'Noto Sans Devanagari', Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0044AA; line-height: 1.2;">
        यूको बैंक
      </div>
      <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40">
          <defs>
            <style>
              .cls-1 {
                fill: #04a;
                stroke-width: 0px;
              }
            </style>
          </defs>
          <path class="cls-1" d="m374.39,261.53v-3.63h1.68l-1.68-5.75v-4.42h2.57l5.57,16.36h-4.86l-.8-2.57h-2.48Zm9.73-13.8h4.42l5.57,9.11v-9.11h4.42v16.36h-4.42l-5.57-8.93v8.93h-4.42v-16.36Zm17.43,0h4.69v6.19l4.86-6.19h6.19l-5.48,6.19,5.57,10.17h-5.57l-3.18-6.63-2.39,2.74v3.98h-4.69v-16.45h0Zm-27.15,0v4.42-.18l-1.68,5.93h1.68v3.63h-2.74l-.8,2.57h-4.69l5.57-16.36h2.65Zm-15.92,16.36v-3.45h.27c.88,0,1.33-.18,1.68-.44.44-.27.62-.8.62-1.24s-.18-.88-.62-1.24c-.27-.27-.8-.44-1.68-.44h-.27v-3.1c.8,0,1.24-.18,1.5-.44.27-.27.44-.62.44-1.24,0-.44-.18-.8-.44-1.06-.27-.27-.8-.44-1.5-.44v-3.36h1.95c1.5,0,2.57.44,3.36,1.24.8.8,1.24,1.86,1.24,2.92s-.27,1.86-.88,2.57c-.27.44-.88.8-1.5,1.06,1.06.27,1.86.8,2.3,1.5.62.62.8,1.5.8,2.57,0,.8-.18,1.5-.44,2.3-.44.62-.88,1.24-1.5,1.5-.44.27-.88.44-1.86.62-1.06.18-1.68.18-1.95.18h-1.5Zm0-16.36v3.36h-1.95v3.18h1.95v3.01h-1.95v3.36h1.95v3.45h-6.63v-16.36h6.63Zm-23.97,16.63v-3.8c.88,0,1.68-.27,2.3-1.06.62-.62.88-1.95.88-3.8,0-1.5-.27-2.57-.88-3.36-.62-.8-1.33-1.06-2.3-1.06v-3.8c2.39,0,4.42.62,5.75,2.12,1.33,1.5,1.95,3.45,1.95,6.19,0,1.86-.27,3.45-.88,4.69s-1.33,2.12-2.57,2.92c-1.06.62-2.39.88-4.07.88l-.18.09h0Zm-31.31-16.63h4.51v9.82c0,.88-.18,1.86-.27,2.74-.27.88-.8,1.68-1.33,2.3-.62.62-1.24,1.06-1.86,1.33-.88.27-1.95.44-3.36.44-.8,0-1.5,0-2.39-.18-.8,0-1.5-.27-2.12-.62-.62-.27-1.06-.8-1.5-1.33-.62-.62-.88-1.33-1.06-1.95-.27-1.06-.44-1.95-.44-2.74v-9.82h4.69v10c0,.88.18,1.68.62,2.12.44.62,1.24.8,1.95.8s1.33-.18,1.86-.8c.44-.44.8-1.24.8-2.12v-10h-.09Zm31.31-.18v3.8c-1.06,0-1.86.27-2.3,1.06-.62.8-.88,1.95-.88,3.63s.27,2.74.88,3.45c.44.8,1.24,1.06,2.3,1.06v3.8c-1.68,0-3.01-.27-4.07-.8-1.06-.62-1.95-1.68-2.74-2.92-.62-1.24-1.06-2.92-1.06-4.69,0-2.74.8-4.86,2.12-6.37,1.33-1.42,3.27-2.03,5.75-2.03Zm-13.53,9.82l3.98,1.33c-.18,1.24-.62,2.3-1.24,3.18-.62.8-1.33,1.33-2.3,1.86-.8.44-1.95.62-3.18.62-1.68,0-3.01-.18-4.07-.8-1.06-.44-1.95-1.33-2.74-2.74-.8-1.24-1.06-2.92-1.06-5.04,0-2.74.62-4.69,1.95-6.19s3.18-2.12,5.57-2.12c1.95,0,3.36.27,4.51,1.24,1.06.8,1.86,2.12,2.3,3.8l-4.07,1.06c-.18-.62-.27-.88-.44-1.06-.18-.44-.44-.8-.88-.88-.27-.27-.8-.27-1.24-.27-1.06,0-1.86.44-2.39,1.33-.44.62-.62,1.68-.62,3.18,0,1.86.18,3.01.8,3.8.44.62,1.24.88,2.12.88s1.5-.18,1.95-.8c.44-.53.8-1.33,1.06-2.39"/>
          <path class="cls-1" d="m110.27,259.67v-3.36s-2.3,1.68-4.42,2.12c-1.06.18-2.74.18-3.8-.8-.62-.62-.62-.88-.88-1.33.62,0,3.18-.27,4.25-2.3,1.24-1.95-.8-4.25-.8-4.25h3.36v-2.92h-13.36v2.92h5.13s2.92.88,1.95,2.92c-.8,1.68-4.86,1.06-4.86,1.06,0,0,0,1.33.27,2.74.8,2.74,3.98,4.86,7.16,4.86,3.89.27,6.01-1.68,6.01-1.68"/>
          <polyline class="cls-1" points="116.29 249.85 116.29 246.93 106.65 246.93 106.65 249.85 109.66 249.85 109.66 264.8 113.46 264.8 113.46 249.85 116.29 249.85"/>
          <path class="cls-1" d="m118.59,271.17s-.44-1.68-2.57-4.69c-1.95-2.74-6.99-3.36-9.55-1.06-1.5,1.33-1.95,3.8.44,5.31,2.57,1.68,5.57.44,5.57.44l-.8-2.12s-1.5.62-2.74.18c-1.06-.62-.8-1.86,0-2.3,1.24-.8,3.8-.62,5.04,1.86,1.06,2.3,1.33,3.36,1.33,3.36l3.27-.97"/>
          <path class="cls-1" d="m143,249.85v-2.92h-18.93v2.92h3.36v2.74c-.88-.62-1.95-.88-3.36-.88v2.74c1.86,0,3.36.8,3.36,2.3,0,1.95-2.12,2.57-3.36,2.57v2.92c1.95-.18,3.36-.88,3.36-.88v3.63h3.8v-8.23s.27-2.3,3.45-2.3c1.86,0,3.01.88,3.01,2.57,0,1.33-1.86,2.3-3.36,2.3v2.74c3.8.18,7.25-2.12,6.99-5.48-.27-2.92-3.18-4.51-6.81-4.51-1.68,0-2.74.27-3.36.62v-2.74l11.85-.09h0Zm-27.86-2.92h8.93v2.92h-8.93v-2.92Zm8.93,4.69v2.74h-.18c-2.3,0-3.01,1.33-3.01,2.39,0,1.5,1.68,2.39,3.18,2.39v2.92c-.62,0-1.06,0-1.5-.18-2.57-.44-5.48-1.95-5.48-5.31,0-2.92,3.01-5.13,6.81-5.04l.18.09"/>
          <path class="cls-1" d="m133.63,247.73l-.27-.18v.35c.09-.09.27-.09.27-.18"/>
          <polyline class="cls-1" points="150.87 249.85 150.87 246.93 141.23 246.93 141.23 249.85 144.24 249.85 144.24 264.8 147.87 264.8 147.87 249.85 150.87 249.85"/>
          <path class="cls-1" d="m147.25,247.29s-.8-3.18-1.95-4.69c-1.33-1.95-2.57-2.57-4.25-3.18-1.86-.62-4.42-.44-4.42-.44l.62,2.74s1.5,0,2.74.27c1.24.27,2.3,1.33,2.74,2.12.88,1.68,1.24,3.18,1.24,3.18h3.27"/>
          <path class="cls-1" d="m150.43,247.73l-.27-.18v.35c.09-.09.27-.09.27-.18"/>
          <path class="cls-1" d="m151.67,247.73v-.18l-.18.18q0,.18.18.18v-.18"/>
          <path class="cls-1" d="m176.44,249.85h.44v-2.92h-.44v2.92Zm0,12.12v-5.48l2.92,1.95v2.57c-.09.09-1.15.62-2.92.97h0Zm0-7.61v-2.74c1.95.44,2.92,1.24,2.92,1.24v2.92c-.09,0-1.42-1.06-2.92-1.42h0Zm0-7.43h-2.92v2.92h2.92v-2.92Zm0,4.69v2.74h-.27c-.88-.27-1.86-.27-2.57,0v-2.83h.88c.71,0,1.33,0,1.95.09Zm0,4.86v5.48c-.62.18-1.24.27-1.95.27h-.88v-2.57h.44c1.33.18,2.39-.18,2.39-.18l-2.92-1.95v-2.92l2.92,1.86Zm-11.41-9.55h8.49v2.92h-8.49v-2.92Zm8.49,4.6c-3.18.27-6.19,2.39-6.19,5.48s2.92,5.04,6.19,5.31v-2.57c-1.06-.27-2.74-1.24-2.74-2.57,0-.88.44-1.24.44-1.24l2.3,1.68v-2.92l-.27-.27h.27v-2.92"/>
          <polyline class="cls-1" points="185.19 249.85 185.19 246.93 175.46 246.93 175.46 249.85 178.56 249.85 178.56 264.8 182.27 264.8 182.27 249.85 185.19 249.85"/>
          <path class="cls-1" d="m182.19,247.11s-1.24-3.98-2.74-5.57c-.88-1.24-1.95-1.95-3.18-2.39v3.01c.27.27.8.8,1.06,1.24,1.33,1.86,1.86,3.8,1.86,3.8h3.01v-.09Zm-5.93,0v-3.18c.27.27.62.62.8,1.06.8,1.06,1.06,2.12,1.06,2.12h-1.86Zm0-8.05c-.44-.27-1.06-.44-1.5-.62h-.27v2.57c.62.27,1.24.62,1.86,1.06v-3.01h-.09Zm0,4.86v3.18h-.8s-.18-.62-.44-1.24c-.18-.27-.27-.62-.62-.88v-2.3c.62.35,1.24.8,1.86,1.24Zm-1.86-5.48v2.57h-.44c-.88-.44-2.3-.27-2.3-.27l-1.24-2.57c.09,0,2.3-.18,3.98.27Zm0,4.25c-.27-.18-.62-.18-1.06-.27-1.24-.27-3.01-.18-3.01-.18l.88,2.12s.88-.18,1.95.18c.44.18.88.27,1.24.44v-2.3"/>
          <path class="cls-1" d="m184.13,240.12c0-.88-.8-1.5-1.95-1.5-.27,0-.62,0-.88.18v2.57c.27.18.62.27.88.27,1.15,0,1.95-.62,1.95-1.5Zm-3.36,6.99v-3.63c.18.44.27.8.44,1.24v2.39h-.44Zm0-6.1v-1.95c0-.18.18-.18.44-.27v2.57c-.27,0-.44-.18-.44-.35Zm.44,6.1h.88s-.27-1.24-.88-2.39v2.39Zm-.44-8.05v1.95c-.27-.27-.62-.62-.62-.88,0-.44.35-.8.62-1.06h0Zm0,4.42c-.44-.8-.88-1.5-1.33-1.95-.88-1.24-1.95-1.95-3.18-2.39v3.01c.27.27.8.8,1.06,1.24,1.33,1.86,1.86,3.8,1.86,3.8h1.68v-3.71h-.09Zm-4.51,3.63v-3.18c.27.27.62.62.8,1.06.8,1.06,1.06,2.12,1.06,2.12h-1.86Zm0-8.05v3.01c-.62-.44-1.24-.8-1.86-1.06v-2.57h.27c.53.18,1.15.35,1.59.62Zm0,4.86v3.18h-.8s-.18-.62-.44-1.24c-.18-.27-.27-.62-.62-.88v-2.3c.62.35,1.24.8,1.86,1.24Zm-1.86-5.48c-1.68-.44-3.98-.27-3.98-.27l1.24,2.57s1.33-.18,2.3.27h.44v-2.57Zm0,4.25c-.27-.18-.62-.18-1.06-.27-1.24-.27-3.01-.18-3.01-.18l.88,2.12s.88-.18,1.95.18c.44.18.88.27,1.24.44v-2.3"/>
          <path class="cls-1" d="m212.08,249.85v-2.92h-18.93v2.92h3.36v2.74c-1.06-.62-2.12-.88-3.36-.88v2.74c1.86,0,3.18.8,3.18,2.3,0,1.95-2.12,2.57-3.18,2.57v2.92c1.95-.18,3.36-.88,3.36-.88v3.63h3.8v-8.23s.27-2.3,3.36-2.3c1.95,0,3.18.88,3.18,2.57,0,1.33-1.95,2.3-3.45,2.3v2.74c3.98.18,7.25-2.12,6.99-5.48-.27-2.92-3.01-4.51-6.63-4.51-1.68,0-2.92.27-3.36.62v-2.74l11.68-.09h0Zm-27.95-2.92h8.93v2.92h-8.93v-2.92Zm8.93,4.69v2.74h-.18c-2.3,0-3.18,1.33-3.18,2.39,0,1.5,1.86,2.39,3.18,2.39h.18v2.92c-.44,0-1.06,0-1.68-.18-2.39-.44-5.48-1.95-5.48-5.31,0-2.92,3.18-5.13,6.99-5.04l.18.09"/>
          <path class="cls-1" d="m202.53,247.73l-.18-.18-.18.18c0,.18.18.18.18.18q.18-.09.18-.18"/>
          <path class="cls-1" d="m270.02,272.94h-8.31v-9.38l7.08-7.43-14.51-15.74v3.98l9.2,10.79-9.2,9.46v16.98h15.74l8.49-8.49v-33.97l-8.58-8.76h-33.61l-8.58,8.76v33.97l8.4,8.49h15.83v-16.98l-9.2-9.46,9.2-10.79v-3.98l-14.51,15.74,7.08,7.43v9.38h-8.31v-33.97h33.52l.27,33.97h0Zm-23.26-18.31c0-3.63,2.92-6.55,6.46-6.55s6.46,2.92,6.46,6.55-2.92,6.55-6.46,6.55c-3.54-.09-6.46-3.01-6.46-6.55Z"/>
        </svg>
      </div>
      <div style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 700; color: #0044AA; text-transform: uppercase;">
        UCO BANK
      </div>
    </div>
    <div style="font-family: Arial, sans-serif; font-size: 8px; color: #0044AA; margin-top: 2px;">
      (A Govt. of India Undertaking)
    </div>
    <div style="background: #0044AA; color: white; font-size: 8px; padding: 2px 8px; margin-top: 4px; font-weight: 600;">
      समग्र आर्थिक विकास का &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Honours Your Trust
    </div>
  </div>
`;


export const renderUcoTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);
  const openingBalance = details.startingBalance;
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : openingBalance;

  // Customer details
  const customerId = `R0${meta.seed.toString().padStart(7, '0')}`;
  const customerName = details.name.toUpperCase();
  const kycId = `CVC${meta.seed}`;
  const mobileNo = details.address?.match(/\d{10}/)?.[0] || '919575826898';
  const emailId = details.email || `YN${meta.seed}@GMAIL.COM`;

  // Branch details
  const branchCode = details.ifsc.slice(-4);
  const branchName = (details.branch || 'ARERA COLONY BHOPAL').toUpperCase();
  const branchAddress = `54/67, ARERA COLONY\nBHOPAL BHOPA Madhya\nPradesh 462016`;
  const ifscCode = details.ifsc;
  const micrCode = '0';
  const phoneNo = '';
  const branchEmail = 'bhoare@UCOBANK.CO.IN';

  // Account details
  const accountType = meta.userType === 'salaried' ? 'Savings' : 'Current';

  // Address formatting
  const addressLines = [
    details.name.toUpperCase(),
    details.address,
    `${details.city} ${details.state}`,
    details.pincode,
  ].filter(Boolean);

  // Split transactions for multi-page layout
  const transactionsPerPage = 20;
  const page1Transactions = transactions.slice(0, transactionsPerPage);
  const page2Transactions = transactions.slice(transactionsPerPage, transactionsPerPage * 2);
  const remainingTransactions = transactions.slice(transactionsPerPage * 2);

  // Transaction row generator with UPI formatting
  const generateTransactionRow = (txn: typeof transactions[0]) => {
    // Format UPI transactions with line break after "/To:" for better readability
    let formattedDescription = txn.description;
    if (formattedDescription.includes('UPI/') && formattedDescription.includes('/To:')) {
      formattedDescription = formattedDescription.replace('/To:', '<br/>/To:');
    }
    
    return `
    <tr>
      <td class="cell-date">${formatUcoDate(txn.date)}</td>
      <td class="cell-desc">${formattedDescription}</td>
      <td class="cell-amount">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
      <td class="cell-amount">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
      <td class="cell-amount">${formatAmount(txn.balance)}</td>
    </tr>
  `;
  };

  const page1Rows = page1Transactions.map(generateTransactionRow).join('');
  const page2Rows = page2Transactions.map(generateTransactionRow).join('');

  // Page 1 - First page with customer details and initial transactions
  const page1Html = `
    <div class="page page-1">
      <div class="header">
        ${buildUcoLogo()}
      </div>

      <div class="statement-title">
        <strong>Statement for account number ${details.accountNumber} Between ${formatUcoDate(startDate)} and ${formatUcoDate(endDate)}</strong>
      </div>

      <div class="details-section">
        <div class="customer-details">
          <table class="info-table">
            <tr>
              <td class="label">Customer ID</td>
              <td class="value">${customerId}</td>
              <td class="label" rowspan="8" style="width: 20px; border: none;"></td>
              <td class="label">Branch Code</td>
              <td class="value">${branchCode}</td>
            </tr>
            <tr>
              <td class="label">KYC ID</td>
              <td class="value"></td>
              <td class="label">Branch Name</td>
              <td class="value">${branchName}</td>
            </tr>
            <tr>
              <td class="label">Name</td>
              <td class="value">${customerName}</td>
              <td class="label" rowspan="3">Address</td>
              <td class="value" rowspan="3">${branchAddress.replace(/\n/g, '<br>')}</td>
            </tr>
            <tr>
              <td class="label" rowspan="4">Address</td>
              <td class="value" rowspan="4">${addressLines.join('<br>')}</td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr>
              <td class="label">IFSC Code</td>
              <td class="value">${ifscCode}</td>
            </tr>
            <tr>
              <td class="label">A/c Type</td>
              <td class="value">${accountType}</td>
              <td class="label">MICR Code</td>
              <td class="value">${micrCode}</td>
            </tr>
            <tr>
              <td class="label">Mobile No.</td>
              <td class="value">${mobileNo}</td>
              <td class="label">Phone</td>
              <td class="value">${phoneNo}</td>
            </tr>
            <tr>
              <td class="label">E-Mail ID</td>
              <td class="value">${emailId}</td>
              <td class="label">E-Mail ID</td>
              <td class="value">${branchEmail}</td>
            </tr>
          </table>
        </div>
      </div>

      <table class="transaction-table">
        <thead>
          <tr>
            <th style="width: 12%;">Date</th>
            <th style="width: 50%;">Particulars</th>
            <th style="width: 13%;">Withdrawals</th>
            <th style="width: 13%;">Deposits</th>
            <th style="width: 12%;">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr class="opening-balance">
            <td colspan="4" style="text-align: right; padding-right: 8px;"><strong>Opening Balance</strong></td>
            <td class="cell-amount"><strong>${formatAmount(openingBalance)}</strong></td>
          </tr>
          ${page1Rows}
        </tbody>
      </table>
    </div>
  `;

  // Page 2 - Continuation of transactions
  const page2Html = page2Transactions.length > 0 ? `
    <div class="page page-2">
      <table class="transaction-table continuation">
        <thead>
          <tr>
            <th style="width: 12%;">Date</th>
            <th style="width: 50%;">Particulars</th>
            <th style="width: 13%;">Withdrawals</th>
            <th style="width: 13%;">Deposits</th>
            <th style="width: 12%;">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${page2Rows}
        </tbody>
      </table>
    </div>
  ` : '';

  // Page 3 - Closing balance and footer
  const page3Html = `
    <div class="page page-3">
      ${remainingTransactions.length > 0 ? `
        <table class="transaction-table continuation">
          <thead>
            <tr>
              <th style="width: 12%;">Date</th>
              <th style="width: 50%;">Particulars</th>
              <th style="width: 13%;">Withdrawals</th>
              <th style="width: 13%;">Deposits</th>
              <th style="width: 12%;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${remainingTransactions.map(generateTransactionRow).join('')}
          </tbody>
        </table>
      ` : ''}

      <table class="transaction-table">
        <tbody>
          <tr class="closing-balance">
            <td colspan="4" style="text-align: right; padding-right: 8px; width: 88%;"><strong>Closing Balance</strong></td>
            <td class="cell-amount" style="width: 12%;"><strong>${formatAmount(closingBalance)}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="footer-note">
        <p><strong>*This is an auto generated e-statement and does not require any signature.</strong></p>
      </div>

      <div class="footer-address">
        <p>
          <strong>UCO BANK REGD ADDRESS:</strong> Digital Banking Department, Head Office-2, 38/4 DD Block, Sector-I, Saltlake, Kolkata,<br/>
          ZIP: 700064. This is an authenticated statement. Customers are requested to immediately notify the Bank of any<br/>
          discrepancy in the statement. The address on this statement is that on record with the Bank as on the last day of<br/>
          requesting this statement.
        </p>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>UCO Bank - Account Statement</title>
      <style>
        @page { 
          margin: 0.8cm 0.7cm;
          size: A4;
        }
        
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          line-height: 1.3;
          color: #000000;
          background: #ffffff;
        }

        .page {
          page-break-after: always;
          padding: 0;
        }

        .page:last-child {
          page-break-after: auto;
        }

        /* Header with logo */
        .header {
          text-align: center;
          margin-bottom: 14px;
        }

        /* Statement title */
        .statement-title {
          text-align: center;
          border: 1px solid #000;
          padding: 6px 10px;
          margin-bottom: 14px;
          font-size: 9px;
        }

        /* Details section */
        .details-section {
          margin-bottom: 14px;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8.5px;
        }

        .info-table td {
          border: 1px solid #000;
          padding: 4px 6px;
          vertical-align: top;
        }

        .info-table .label {
          font-weight: normal;
          width: 18%;
          background: #ffffff;
        }

        .info-table .value {
          width: 32%;
          background: #ffffff;
        }

        /* Transaction table */
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8px;
          margin-bottom: 0;
        }

        .transaction-table.continuation {
          margin-bottom: 10px;
        }

        .transaction-table thead th {
          background: #ffffff;
          border: 1px solid #000;
          padding: 5px 4px;
          text-align: center;
          font-weight: bold;
          line-height: 1.2;
        }

        .transaction-table tbody td {
          border: 1px solid #000;
          padding: 4px 5px;
          vertical-align: top;
        }

        .transaction-table tbody tr.opening-balance td,
        .transaction-table tbody tr.closing-balance td {
          background: #ffffff;
          font-weight: bold;
        }

        .cell-date {
          text-align: left;
          font-size: 8px;
          white-space: nowrap;
        }

        .cell-desc {
          text-align: left;
          font-size: 7.5px;
          line-height: 1.3;
        }

        .cell-amount {
          text-align: right;
          font-size: 8px;
          font-variant-numeric: tabular-nums;
        }

        /* Footer sections */
        .footer-note {
          margin-top: 16px;
          text-align: center;
          font-size: 8.5px;
        }

        .footer-address {
          margin-top: 14px;
          font-size: 7.5px;
          line-height: 1.5;
          text-align: justify;
        }
      </style>
    </head>
    <body>
      ${page1Html}
      ${page2Html}
      ${page3Html}
    </body>
  </html>`;
};