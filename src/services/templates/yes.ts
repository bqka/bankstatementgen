import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatYesDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd MMM yyyy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// YES Bank logo - Official SVG
const buildYesLogo = () => `
  <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1537 263" width="140" height="24">
    <g>
      <path fill="#eb1f48" d="m109.6 197.9c12.3 0 17.7-16.2 7.7-23.9q-1.6-1.6-3.9-3.9c-48.6-39.3-63.3-30.1-111.9-13.1-1.5 0.8-1.5 3.1 0 3.9 14.7 3 28.6 12.3 47.1 31.6l55.6 5.4q2.3 0 5.4 0zm228.3-196.7l-186.7 186.7c-13.1 13.8-32.4 20.8-51.7 19.2l-44.7-3.8 46.3 44.7c24.7 23.2 64 18.5 82.5-9.2l157.4-235.3c0.8-1.6-1.5-3.9-3.1-2.3z"/>
      <path fill="#002eda" fill-rule="evenodd" d="m405.8 68.3l36.3 71.7c0.7 0.8 2.3 0.8 3.1 0l35.4-71.7c0-1.6 0.8-2.3 3.1-2.3h38.6c0.8 0 1.5 1.5 0.8 2.3l-59.4 113.4v57.1q0 2.3-2.3 2.3h-36.3q-2.3 0-2.3-2.3v-57.9l-59.4-112.6c-0.8-1.6 0-2.3 1.5-2.3h37.8c1.6 0 2.3 0.7 3.1 2.3zm253.1 138.8v31.7q0 2.3-2.4 2.3h-118.8q-2.3 0-2.3-2.3v-170.5q0-2.3 2.3-2.3h125c1.6 0 2.3 1.5 1.6 3.1-1.6 3.8-10.1 27-10.8 29.3-0.8 1.5-1.6 2.3-3.1 2.3h-73.3q-1.6 0-1.6 2.3v30.9q0 2.3 1.6 2.3h64.8q2.3 0 2.3 2.3v28.5q0 1.6-2.3 1.6h-64.8q-1.6 0-1.6 2.3v31.6q0 2.3 1.6 2.3h79.4q2.4 0 2.4 2.3zm131.1-104.9h-60.2c-10 0-14.6 4.7-14.6 12.4 0 7.7 6.2 11.5 20 16.9l24 8.5c29.3 10.1 43.2 21.6 43.2 50.2 0 30.1-20.1 50.9-64.1 50.9h-59.4q-1.5 0-1.5-2.3v-31.7q0-2.3 1.5-2.3h64.1c12.3 0 17.7-5.4 17.7-13.9 0-9.2-6.2-13.8-23.1-20l-22.4-7.7c-22.4-7.7-41.7-20.1-41.7-47.1 0-33.2 24.7-50.1 61-50.1h55.5q2.3 0 2.3 2.3v31.6q0 2.3-2.3 2.3zm91.8 136.6v-170.5q0-2.3 2.3-2.3h87.2c33.2 0 47.1 23.9 47.1 45.5 0 17-8.5 32.4-23.9 39.3 21.6 7 31.6 21.6 31.6 42.5 0 30-21.6 47.8-57.1 47.8h-84.9q-2.3 0-2.3-2.3zm40.1-136.6v32.4q0 2.3 2.4 2.3h34.7c12.3 0 20-6.1 20-18.5 0-11.5-6.9-18.5-20-18.5h-34.7q-2.4 0-2.4 2.3zm0 68.7v33.9q0 2.3 2.4 2.3h40.1c13.9 0 20.8-7.7 20.8-18.5 0-11.5-6.2-20-20.8-20h-40.1q-2.4 0-2.4 2.3zm169-104.9h40.9c2.3 0 2.3 0.7 3.1 2.3l58.6 170.5c0 1.5 0 2.3-1.5 2.3h-37.1c-1.5 0-1.5-0.8-2.3-2.3l-11.6-34.7q0-2.4-2.3-2.4h-53.2c-1.5 0-2.3 0.8-3.1 2.4l-10.8 34.7c-0.8 1.5-0.8 2.3-3.1 2.3h-36.2c-1.6 0-2.3-0.8-1.6-3.1l57.9-169.7q0-2.3 2.3-2.3zm40.9 106.4l-19.3-63.2c0-1.6-1.5-1.6-1.5 0l-19.3 63.2q-0.8 2.3 1.5 2.3h37q1.6 0 1.6-2.3zm111.9 68.7h-35.5q-1.6 0-1.6-2.3v-170.5q0-2.3 1.6-2.3h28.5l1.6 0.7 78.7 102.6v-101q0-2.3 1.5-2.3h35.5q2.3 0 2.3 2.3v171.2c0 0.8-0.8 1.6-1.5 1.6h-27.8l-1.6-0.8-79.4-101.8v100.3q0 2.3-2.3 2.3zm141.1-2.3v-170.5q0-2.3 2.4-2.3h34.7q2.3 0 2.3 2.3v70.2c0 0.8 1.5 1.5 2.3 0l61-70.2c1.5-1.6 2.3-2.3 4.6-2.3h37.8c1.5 0 2.3 2.3 0.8 3.1l-61 74q-0.8 0.8 0 2.3l66.4 92.6c0.7 1.5 0 3.1-1.6 3.1h-40.1c-1.5 0-2.3-0.8-2.3-1.6l-47.9-67.1q-1.5-1.5-2.3 0l-16.9 17.8q-0.8 0.7-0.8 1.5v47.1q0 2.3-2.3 2.3h-34.7q-2.4 0-2.4-2.3z"/>
    </g>
  </svg>
`;


export const renderYesTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);
  const openingBalance = details.startingBalance;
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : openingBalance;

  // Split transactions for multi-page layout
  const transactionsPerPage = 19; // Increased from 15 for better page utilization
  const allPages: string[] = [];
  
  const customerName = details.name.toUpperCase();
  const addressParts = details.address?.split(',') || [];
  const addressLine1 = addressParts[0] || '';
  const cityState = [details.city, details.state].filter(Boolean).join(', ').toUpperCase();

  const branchName = (details.branch || 'BARELI, MADHYA PRADESH').toUpperCase();
  const branchAddress = 'SarvNo.368/1/2';
  const branchCity = cityState || 'MADHYA PRADESH';

  const customerId = meta.seed.toString().padStart(8, '0');

  // Transaction row generator with proper UPI formatting
  const generateTransactionRow = (txn: typeof transactions[0]) => {
    // Format description with proper line breaks for UPI transactions
    let formattedDesc = txn.description;
    
    // Check if it's a UPI transaction and format with line breaks
    if (formattedDesc.includes('UPI/') && formattedDesc.includes('/From:') && formattedDesc.includes('/To:')) {
      // Split at "To:" to create proper line break
      const toIndex = formattedDesc.indexOf('/To:');
      if (toIndex > 0) {
        formattedDesc = formattedDesc.substring(0, toIndex + 1) + '<br/>' + 
                       formattedDesc.substring(toIndex + 1);
      }
    }
    
    return `
    <tr>
      <td class="cell-date">${formatYesDate(txn.date)}</td>
      <td class="cell-date">${formatYesDate(txn.date)}</td>
      <td class="cell-ref">${txn.reference || '-'}</td>
      <td class="cell-desc">${formattedDesc}</td>
      <td class="cell-amount">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
      <td class="cell-amount">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
      <td class="cell-amount">${formatAmount(txn.balance)}</td>
    </tr>
  `;
  };

  // Generate Page 1 with customer details
  const page1Transactions = transactions.slice(0, transactionsPerPage);
  const page1Rows = page1Transactions.map(generateTransactionRow).join('');

  // Page 1 - First page with customer details and initial transactions
  const page1Html = `
    <div class="page page-1">
      <div class="header">
        <div class="logo-wrapper">
          ${buildYesLogo()}
        </div>
      </div>

      <div class="statement-header">
        <div class="statement-title">
          <strong>Statement of account:</strong> ${details.accountNumber}
        </div>
        <div class="statement-period">
          <strong>Period:</strong> ${formatYesDate(startDate)} - ${formatYesDate(endDate)}
        </div>
      </div>

      <div class="customer-section">
        <div class="customer-info">
          <div class="info-title"><strong>${customerName}</strong></div>
          <div>${addressLine1}</div>
          ${addressParts.slice(1).map(line => `<div>${line.trim()}</div>`).join('')}
          <div>${cityState}</div>
          ${details.pincode ? `<div>${details.pincode}</div>` : ''}
          <div style="margin-top: 8px;"><strong>Mobile No:</strong> Registered</div>
          <div><strong>Email:</strong> ${details.email || 'Not Registered'}</div>
          <div><strong>Cust ID:</strong> ${customerId}</div>
        </div>

        <div class="branch-info">
          <div class="info-title"><strong>Your Branch details:</strong></div>
          <div><strong>Name:</strong> ${branchName}</div>
          <div>${branchAddress}</div>
          <div>Tehsil, Bareli</div>
          <div>Dist-Raisen MP- ${details.pincode || '464668'}</div>
          <div>${branchCity}</div>
          <div>INDIA</div>
          <div style="margin-top: 8px;">
            <strong>IFSC Code:</strong> ${details.ifsc}
            &nbsp;&nbsp;&nbsp;
            <strong>MICR Code:</strong> 464532501
          </div>
        </div>
      </div>

      <div class="transaction-header">
        Transaction details for your account number <strong>${details.accountNumber}</strong> (SAVING) (Currency - INR)
      </div>

      <div class="account-summary">
        <div class="summary-row">
          <div class="summary-item">
            <strong>Primary Holder:</strong> ${customerName}
          </div>
          <div class="summary-item">
            <strong>A/C Opening Date:</strong> 12/02/2019
          </div>
          <div class="summary-item">
            <strong>Account Variant/ Description:</strong> SA - SAVINGS VALUE
          </div>
        </div>
        <div class="summary-row">
          <div class="summary-item">
            <strong>Nominee Details:</strong> Registered
          </div>
          <div class="summary-item">
            <strong>Account Status:</strong> ACTIVE
          </div>
          <div class="summary-item">
            <strong>Joint Holder's Names:</strong>
          </div>
        </div>
      </div>

      <table class="transaction-table">
        <thead>
          <tr>
            <th style="width: 10%;">Transaction<br/>Date</th>
            <th style="width: 10%;">Value Date</th>
            <th style="width: 15%;">Cheque No/Reference No</th>
            <th style="width: 38%;">Description</th>
            <th style="width: 9%;">Withdrawals</th>
            <th style="width: 9%;">Deposits</th>
            <th style="width: 9%;">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          ${page1Rows}
        </tbody>
      </table>
    </div>
  `;

  allPages.push(page1Html);

  // Generate middle pages (Page 2, 3, 4, etc.) with continuation of transactions
  const remainingTransactions = transactions.slice(transactionsPerPage);
  const numberOfMiddlePages = Math.ceil(remainingTransactions.length / transactionsPerPage);

  for (let i = 0; i < numberOfMiddlePages; i++) {
    const startIdx = i * transactionsPerPage;
    const endIdx = startIdx + transactionsPerPage;
    const pageTransactions = remainingTransactions.slice(startIdx, endIdx);
    const pageRows = pageTransactions.map(generateTransactionRow).join('');

    const middlePageHtml = `
    <div class="page page-middle">
      <div class="page-header">
        <div class="header-left">
          <strong>Customer Id:</strong> ${customerId}
        </div>
        <div class="header-right">
          <strong>Primary Account Holder Name:</strong> ${customerName}
        </div>
      </div>

      <div class="transaction-header">
        Transaction details for your account number <strong>${details.accountNumber}</strong> (SAVING) (Currency - INR)
      </div>

      <div class="account-summary">
        <div class="summary-row">
          <div class="summary-item">
            <strong>Primary Holder:</strong> ${customerName}
          </div>
          <div class="summary-item">
            <strong>A/C Opening Date:</strong> 12/02/2019
          </div>
          <div class="summary-item">
            <strong>Account Variant/ Description:</strong> SA - SAVINGS VALUE
          </div>
        </div>
        <div class="summary-row">
          <div class="summary-item">
            <strong>Nominee Details:</strong> Registered
          </div>
          <div class="summary-item">
            <strong>Account Status:</strong> ACTIVE
          </div>
          <div class="summary-item">
            <strong>Joint Holder's names:</strong>
          </div>
        </div>
      </div>

      <table class="transaction-table">
        <thead>
          <tr>
            <th style="width: 10%;">Transaction<br/>Date</th>
            <th style="width: 10%;">Value Date</th>
            <th style="width: 15%;">Cheque No/Reference No</th>
            <th style="width: 38%;">Description</th>
            <th style="width: 9%;">Withdrawals</th>
            <th style="width: 9%;">Deposits</th>
            <th style="width: 9%;">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          ${pageRows}
        </tbody>
      </table>
    </div>
    `;

    allPages.push(middlePageHtml);
  }

  // Generate final page with transaction codes and footer
  const finalPageHtml = `
    <div class="page page-final">
      <div class="page-header">
        <div class="header-left">
          <strong>Customer Id:</strong> ${customerId}
        </div>
        <div class="header-right">
          <strong>Primary Account Holder Name:</strong> ${customerName}
        </div>
      </div>

      <div class="transaction-header">
        Transaction details for your account number <strong>${details.accountNumber}</strong> (SAVING) (Currency - INR)
      </div>

      <div class="codes-section">
        <div class="codes-title">Transaction codes in your account statement</div>
        <table class="codes-table">
          <tbody>
            <tr>
              <td><strong>ATWC/SWD/ATD</strong> - ATM Withdrawal</td>
              <td><strong>OBD/OBC</strong> - Mobile Funds Transfer</td>
            </tr>
            <tr>
              <td><strong>AFD / AFC</strong> - ATM Funds Transfer</td>
              <td><strong>PCD</strong> - Paychest</td>
            </tr>
            <tr>
              <td><strong>R- RPT</strong> - UTR - Returned RTGS</td>
              <td><strong>R- UTP</strong> - RTGS Transaction</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="notice-section">
        <p>
          Please check the entries in the statement and in case of any discrepancy, report the same within 30 days by visiting the nearest YES BANK branch or calling our YES TOUCH toll free number 1800 1200. Unless the discrepancy/errors/omissions/unauthorized debits are immediately brought to the bank's notice, the entries in the statement shall be deemed to be correct and shall bind the constituent for all purposes and interest.
        </p>
        <p style="margin-top: 10px;">
          * Reward points accrued to your card includes expired points
        </p>
        <p style="margin-top: 6px;">
          To redeem your Rewards points, login to <a href="www.Yesbank.in" style="color: #002eda; text-decoration: none;">www.Yesbank.in</a> or call YES Rewards customer care 1800 1200
        </p>
      </div>

      <div class="footer-contact">
        <div class="contact-icons">
          <div class="contact-item">
            <div class="icon-circle">
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="#002eda" stroke="#002eda" stroke-width="1"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="18" font-weight="bold">%</text>
              </svg>
            </div>
            <div class="contact-text">
              <strong>SMS "Help" (space &lt;CLUT ID&gt;</strong><br/>
              to +91 95522 95522
            </div>
          </div>

          <div class="contact-item">
            <div class="icon-circle">
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="#002eda"/>
                <path d="M16 8 C12 8 8 11 8 15 C8 16 8.5 17 9 18 L9 22 L13 20 C14 20.5 15 21 16 21 C20 21 24 18 24 14 C24 10 20 8 16 8 M16 10 C19 10 22 12 22 14 C22 17 19 19 16 19 C15 19 14 18.5 13 18 L11 19 L11 17 C10.5 16 10 15 10 14 C10 11 13 10 16 10" fill="white"/>
              </svg>
            </div>
            <div class="contact-text">
              <strong>YES TOUCH PhoneBanking Number:</strong><br/>
              1800 1200 (Toll Free for Mobile & Landlines in India)
              +91 22 4935 0000 (When calling from Outside India)<br/>
              Toll free number from <strong>USA:</strong> (833)300 0149 | <strong>Canada:</strong> (833)21 00149 | <strong>UK:</strong> 08003768513 | <strong>UAE:</strong> 800037025182
            </div>
          </div>

          <div class="contact-item">
            <div class="icon-circle">
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="#002eda"/>
                <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold">@</text>
              </svg>
            </div>
            <div class="contact-text">
              <strong>Email us at</strong><br/>
              <a href="mailto:yesbookc@yesbank.in" style="color: #002eda; text-decoration: none;">yesbookc@yesbank.in</a>
            </div>
          </div>
        </div>

        <div class="cin-number">
          <strong>CIN - L65190MH2003PLC143249</strong>
        </div>
      </div>
    </div>
  `;

  allPages.push(finalPageHtml);

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>YES Bank - Account Statement</title>
      <style>
        @page { 
          margin: 0.8cm 0.6cm;
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
          line-height: 1.4;
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

        /* Page 1 specific styles */
        .page-1 .header {
          text-align: right;
          margin-bottom: 16px;
        }

        .logo-wrapper {
          display: inline-block;
        }

        .statement-header {
          border: 1px solid #000;
          padding: 8px 12px;
          margin-bottom: 12px;
          text-align: center;
        }

        .statement-title {
          margin-bottom: 4px;
        }

        .customer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 14px;
          font-size: 8.5px;
          line-height: 1.5;
        }

        .customer-info,
        .branch-info {
          border: 1px solid #d0d0d0;
          padding: 10px 12px;
        }

        .info-title {
          margin-bottom: 6px;
        }

        /* Page 2+ header */
        .page-header {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          margin-bottom: 12px;
          font-size: 9px;
        }

        /* Transaction header */
        .transaction-header {
          border: 1px solid #000;
          padding: 6px 10px;
          margin-bottom: 10px;
          text-align: center;
          font-size: 9px;
        }

        /* Account summary */
        .account-summary {
          margin-bottom: 12px;
          font-size: 8.5px;
        }

        .summary-row {
          display: flex;
          gap: 15px;
          margin-bottom: 6px;
        }

        .summary-item {
          flex: 1;
        }

        /* Transaction table */
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8px;
          margin-bottom: 16px;
        }

        .transaction-table thead th {
          background: #f5f5f5;
          border: 1px solid #999;
          padding: 7px 5px;
          text-align: center;
          font-weight: bold;
          line-height: 1.2;
          font-size: 8.5px;
        }

        .transaction-table tbody td {
          border: 1px solid #ccc;
          padding: 6px 5px;
          vertical-align: top;
        }

        .transaction-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .cell-date {
          text-align: center;
          font-size: 8px;
          white-space: nowrap;
        }

        .cell-ref {
          text-align: left;
          font-size: 7.5px;
          word-break: break-all;
        }

        .cell-desc {
          text-align: left;
          font-size: 7.5px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .cell-amount {
          text-align: right;
          font-size: 8px;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        /* Page 3 - Transaction codes */
        .codes-section {
          margin: 20px 0;
        }

        .codes-title {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 9px;
        }

        .codes-table {
          width: 100%;
          border-collapse: collapse;
        }

        .codes-table td {
          padding: 4px 0;
          font-size: 8.5px;
        }

        /* Notice section */
        .notice-section {
          margin: 16px 0;
          font-size: 8px;
          line-height: 1.5;
          text-align: justify;
        }

        /* Footer contact */
        .footer-contact {
          margin-top: 20px;
        }

        .contact-icons {
          display: flex;
          gap: 20px;
          margin-bottom: 14px;
          align-items: flex-start;
        }

        .contact-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          flex: 1;
        }

        .icon-circle {
          flex-shrink: 0;
        }

        .contact-text {
          font-size: 7.5px;
          line-height: 1.4;
        }

        .cin-number {
          text-align: center;
          padding: 8px;
          border: 1px solid #000;
          border-radius: 20px;
          font-size: 9px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      ${allPages.join('\n')}
    </body>
  </html>`;
};