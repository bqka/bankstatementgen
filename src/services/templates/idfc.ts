import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatIdfcDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd-MMM-yyyy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// IDFC First Bank logo
const buildIdfcLogo = () => `
  <div style="display: inline-block;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 201 71" width="140" height="50">
      <rect x="0" y="0" width="201" height="71" fill="#9d1d26"/>
      <path fill="#ffffff" fill-rule="evenodd" d="M 15.367188 15.367188 L 55.625 15.367188 L 55.625 55.636719 L 15.363281 55.636719 Z M 59.015625 11.976562 L 11.972656 11.976562 L 11.972656 59.023438 L 59.015625 59.023438 Z M 59.015625 11.976562 "/>
      <path fill="#ffffff" fill-rule="evenodd" d="M 19.671875 27.375 L 51.320312 27.375 L 51.320312 19.675781 L 19.671875 19.675781 Z M 19.671875 51.324219 L 27.371094 51.324219 L 27.371094 43.625 L 19.671875 43.625 Z M 19.671875 39.347656 L 39.34375 39.347656 L 39.34375 31.652344 L 19.671875 31.652344 Z M 70.992188 35.925781 L 74.414062 35.925781 L 74.414062 19.675781 L 70.992188 19.675781 Z M 80.554688 22.421875 L 80.554688 32.820312 L 83.449219 32.820312 C 86.625 32.820312 87.355469 31.605469 87.355469 27.566406 C 87.355469 23.261719 86.890625 22.421875 83.09375 22.421875 Z M 83.890625 19.703125 C 88.875 19.703125 90.664062 21.867188 90.664062 27.542969 C 90.664062 32.996094 88.765625 35.539062 83.867188 35.539062 L 77.289062 35.539062 L 77.289062 19.703125 Z M 93.199219 19.703125 L 104.320312 19.703125 L 104.320312 22.421875 L 96.464844 22.421875 L 96.464844 26.128906 L 103.328125 26.128906 L 103.328125 28.847656 L 96.464844 28.847656 L 96.464844 35.539062 L 93.199219 35.539062 Z M 119.546875 30.324219 C 119.328125 33.417969 117.605469 35.890625 112.730469 35.890625 C 107.960938 35.890625 105.558594 33.527344 105.558594 27.699219 C 105.558594 22 107.832031 19.351562 112.75 19.351562 C 116.636719 19.351562 119.019531 21.007812 119.546875 24.628906 L 116.28125 24.628906 C 115.90625 23.214844 115.445312 22.132812 112.75 22.132812 C 110.058594 22.132812 108.867188 23.746094 108.867188 27.984375 C 108.867188 31.273438 109.75 33.109375 112.792969 33.109375 C 114.980469 33.109375 116.019531 32.425781 116.28125 30.324219 Z M 128.242188 19.703125 L 139.363281 19.703125 L 139.363281 22.421875 L 131.507812 22.421875 L 131.507812 26.128906 L 138.371094 26.128906 L 138.371094 28.847656 L 131.507812 28.847656 L 131.507812 35.539062 L 128.242188 35.539062 Z M 128.242188 19.703125 "/>
      <path fill="#ffffff" fill-rule="evenodd" d="M 141.480469 35.539062 L 144.746094 35.539062 L 144.746094 19.703125 L 141.480469 19.703125 Z M 151.082031 22.421875 L 151.082031 26.59375 L 154.015625 26.59375 C 156.640625 26.59375 157.523438 26.328125 157.523438 24.339844 C 157.523438 22.75 156.972656 22.421875 154.214844 22.421875 Z M 147.816406 19.703125 L 154.679688 19.703125 C 157.964844 19.703125 160.835938 19.792969 160.835938 24.453125 C 160.835938 27.542969 159.554688 28.691406 157.746094 29.113281 L 161.871094 35.539062 L 157.898438 35.539062 L 154.015625 29.308594 L 151.082031 29.308594 L 151.082031 35.539062 L 147.816406 35.539062 Z M 166 30.570312 C 166.128906 32.226562 166.375 33.109375 169.507812 33.109375 C 171.164062 33.109375 172.375 32.867188 172.375 31.253906 C 172.375 30.28125 171.933594 29.753906 170.542969 29.375 L 166.703125 28.339844 C 164.785156 27.832031 163.085938 26.902344 163.085938 24.011719 C 163.085938 21.734375 164.121094 19.351562 169.019531 19.351562 C 173.675781 19.351562 175.132812 21.515625 175.199219 24.339844 L 171.933594 24.339844 C 171.777344 23.019531 171.714844 22.132812 168.886719 22.132812 C 167.234375 22.132812 166.394531 22.441406 166.394531 23.699219 C 166.394531 24.851562 167.078125 25.179688 168.007812 25.425781 L 171.535156 26.375 C 173.789062 26.96875 175.683594 27.851562 175.683594 31.007812 C 175.683594 35.472656 171.867188 35.890625 169.507812 35.890625 C 164.34375 35.890625 162.929688 33.859375 162.734375 30.570312 Z M 181.222656 22.488281 L 176.457031 22.488281 L 176.457031 19.703125 L 189.234375 19.703125 L 189.234375 22.488281 L 184.488281 22.488281 L 184.488281 35.535156 L 181.222656 35.535156 Z M 74.222656 52.316406 L 74.222656 56.492188 L 77.160156 56.492188 C 80.136719 56.492188 80.796875 56.269531 80.796875 54.460938 C 80.796875 52.558594 80.183594 52.316406 77.796875 52.316406 Z M 74.222656 46.09375 L 74.222656 49.601562 L 77.886719 49.601562 C 79.851562 49.601562 80.335938 49.359375 80.335938 47.726562 C 80.335938 46.402344 80.027344 46.089844 77.269531 46.089844 L 74.222656 46.089844 Z M 78.679688 43.375 C 81.792969 43.375 83.492188 44.476562 83.492188 47.484375 C 83.492188 49.933594 82.367188 50.441406 81.683594 50.726562 C 83.625 51.476562 84.109375 52.980469 84.109375 54.636719 C 84.109375 57.242188 82.917969 59.207031 78.546875 59.207031 L 70.957031 59.207031 L 70.957031 43.375 Z M 93.136719 53.84375 L 90.992188 54.195312 C 89.824219 54.371094 88.988281 54.613281 88.988281 55.851562 C 88.988281 56.734375 89.425781 57.222656 90.792969 57.222656 C 92.671875 57.222656 93.136719 56.203125 93.136719 54.769531 Z M 86.273438 51.105469 C 86.425781 48.097656 88.144531 47.285156 91.28125 47.285156 C 94.5 47.285156 96.199219 48.144531 96.199219 50.683594 L 96.199219 59.207031 L 93.265625 59.207031 L 93.265625 58.324219 C 92.671875 58.941406 91.542969 59.496094 89.691406 59.496094 C 86.910156 59.496094 85.917969 58.257812 85.917969 56.273438 C 85.917969 53.6875 87.59375 52.714844 89.296875 52.449219 L 93.136719 51.851562 L 93.136719 51.148438 C 93.136719 50.066406 92.582031 49.753906 91.148438 49.753906 C 89.625 49.753906 89.316406 50.109375 89.164062 51.105469 Z M 106.394531 52.515625 C 106.394531 50.730469 106.375 49.800781 104.410156 49.800781 C 102.222656 49.800781 101.980469 50.949219 101.980469 53.6875 L 101.980469 59.207031 L 98.914062 59.207031 L 98.914062 47.570312 L 101.828125 47.570312 L 101.828125 49.070312 C 102.664062 47.945312 103.574219 47.285156 105.710938 47.285156 C 108.691406 47.285156 109.464844 48.5625 109.464844 52.097656 L 109.464844 59.207031 L 106.394531 59.207031 Z M 112.421875 43.375 L 115.488281 43.375 L 115.488281 51.875 L 119.261719 47.570312 L 123.035156 47.570312 L 118.976562 51.988281 L 123.191406 59.207031 L 119.636719 59.207031 L 116.8125 54.152344 L 115.488281 55.519531 L 115.488281 59.207031 L 112.421875 59.207031 Z M 112.421875 43.375 "/>
    </svg>
  </div>
`;

export const renderIdfcTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);

  const totalCredit = transactions.reduce((sum, txn) => sum + txn.credit, 0);
  const totalDebit = transactions.reduce((sum, txn) => sum + txn.debit, 0);
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : details.startingBalance;

  const transactionRows = transactions
    .map(
      (txn) => `
      <tr>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: center; font-size: 6.5px;">${formatIdfcDate(txn.date)}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: center; font-size: 6.5px;">${formatIdfcDate(txn.date)}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: left; font-size: 6.5px;">${txn.description.replace(/\n/g, '<br/>')}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: center; font-size: 6.5px;">${txn.reference || ''}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: right; font-size: 6.5px;">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: right; font-size: 6.5px;">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
        <td style="border: 1px solid #333; padding: 2px 4px; text-align: right; font-size: 6.5px;">${formatAmount(txn.balance)}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>IDFC FIRST Bank - Account Statement</title>
      <style>
        @page { margin: 0.5cm; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: Arial, sans-serif;
          font-size: 7px;
          line-height: 1.2;
          color: #000;
          background: #fff;
          padding: 12px;
        }

        .header-section {
          display: table;
          width: 100%;
          margin-bottom: 8px;
        }

        .header-row {
          display: table-row;
        }

        .header-left {
          display: table-cell;
          width: 70%;
          vertical-align: top;
        }

        .header-right {
          display: table-cell;
          width: 30%;
          text-align: right;
          vertical-align: top;
        }

        .statement-title {
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .account-info {
          display: table;
          width: 100%;
          margin-bottom: 8px;
          border-top: 1px solid #000;
          padding-top: 6px;
        }

        .account-row {
          display: table-row;
        }

        .account-left {
          display: table-cell;
          width: 50%;
          padding-right: 12px;
          vertical-align: top;
        }

        .account-right {
          display: table-cell;
          width: 50%;
          padding-left: 12px;
          vertical-align: top;
          border-left: 1px solid #ccc;
        }

        .info-row {
          margin-bottom: 2px;
          line-height: 1.3;
          font-size: 7px;
        }

        .info-label {
          display: inline-block;
          width: 140px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 7px;
        }

        .info-value {
          display: inline;
          font-size: 7px;
        }

        .summary-box {
          background: #f0f0f0;
          border: 1px solid #000;
          padding: 6px;
          margin: 8px 0;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
        }

        .summary-table th,
        .summary-table td {
          padding: 3px 6px;
          text-align: left;
          border: none;
          font-size: 7px;
        }

        .summary-table th {
          font-weight: bold;
          text-transform: capitalize;
        }

        .summary-table td {
          text-align: right;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 6.5px;
          margin-top: 4px;
        }

        .transaction-table thead th {
          background: #fff;
          border: 1px solid #000;
          padding: 4px 2px;
          text-align: center;
          font-weight: bold;
          font-size: 6.5px;
          line-height: 1.1;
          text-transform: capitalize;
        }

        .transaction-table tbody td {
          padding: 3px 2px;
          border: 1px solid #000;
          vertical-align: top;
          font-size: 6.5px;
          line-height: 1.2;
        }

        .transaction-table .col-date {
          width: 60px;
          text-align: center;
        }

        .transaction-table .col-value-date {
          width: 60px;
          text-align: center;
        }

        .transaction-table .col-particulars {
          width: auto;
          text-align: left;
        }

        .transaction-table .col-cheque {
          width: 50px;
          text-align: center;
        }

        .transaction-table .col-debit {
          width: 70px;
          text-align: right;
        }

        .transaction-table .col-credit {
          width: 70px;
          text-align: right;
        }

        .transaction-table .col-balance {
          width: 75px;
          text-align: right;
        }

        .opening-balance-row td {
          font-weight: bold;
          background: #ffffff;
        }

        .footer {
          margin-top: 12px;
          font-size: 5.5px;
          line-height: 1.3;
          border-top: 1px solid #000;
          padding-top: 6px;
        }

        .footer strong {
          font-size: 6px;
          text-transform: uppercase;
        }

        .page-number {
          text-align: right;
          font-size: 7px;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-row">
          <div class="header-left">
            <div class="statement-title">STATEMENT OF ACCOUNT</div>
            <div class="info-row">
              <span class="info-label">CUSTOMER ID</span> : <span class="info-value">${statement.id.substring(0, 10)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ACCOUNT NO</span> : <span class="info-value">${details.accountNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">STATEMENT PERIOD</span> : <span class="info-value">${formatIdfcDate(startDate)} TO ${formatIdfcDate(endDate)}</span>
            </div>
          </div>
          <div class="header-right">
            ${buildIdfcLogo()}
          </div>
        </div>
      </div>

      <!-- Account Information -->
      <div class="account-info">
        <div class="account-row">
          <div class="account-left">
            <div class="info-row">
              <span class="info-label">CUSTOMER NAME</span> : <span class="info-value">Mr. ${details.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">COMMUNICATION ADDRESS</span> : <span class="info-value">${details.address || 'gram kachnariya vidisha'}</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">Sankalkheda Khurd Vidisha</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">post sankalkheda khurd</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">${details.city || 'VIDISHA'} ${details.pincode || '464113'} ${details.state || 'MADHYA'}</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">PRADESH INDIA</span>
            </div>
            <div class="info-row" style="margin-top: 3px;">
              <span class="info-label">EMAIL ID</span> : <span class="info-value">n**********d@idfcfirstban k.com</span>
            </div>
            <div class="info-row">
              <span class="info-label">PHONE NO</span> : <span class="info-value">*******${details.phone ? details.phone.substring(7) : '2034'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CKYC ID</span> : <span class="info-value">*********3863</span>
            </div>
            <div class="info-row">
              <span class="info-label">NOMINATION</span> : <span class="info-value">Registered</span>
            </div>
            <div class="info-row">
              <span class="info-label">NOMINEE NAME</span> : <span class="info-value">Bhupendra Yadav</span>
            </div>
          </div>

          <div class="account-right">
            <div class="info-row">
              <span class="info-label">ACCOUNT BRANCH</span> : <span class="info-value">${details.branch || 'VIDISHA BRANCH'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">BRANCH ADDRESS</span> : <span class="info-value">GRND FLR AND FIRST FLR,</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">PLOT NO.19, WARD NO.5/11,</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">SANCHI VIDISHA RD,VIDISHA,</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">MADHYA PRADESH-464001</span>
            </div>
            <div class="info-row" style="padding-left: 142px;">
              <span class="info-value">464001</span>
            </div>
            <div class="info-row" style="margin-top: 3px;">
              <span class="info-label">IFSC</span> : <span class="info-value">${details.ifsc}</span>
            </div>
            <div class="info-row">
              <span class="info-label">MICR</span> : <span class="info-value">464751002</span>
            </div>
            <div class="info-row">
              <span class="info-label">ACCOUNT OPENING DATE</span> : <span class="info-value">2023-08-14</span>
            </div>
            <div class="info-row">
              <span class="info-label">ACCOUNT STATUS</span> : <span class="info-value">ACTIVE</span>
            </div>
            <div class="info-row">
              <span class="info-label">ACCOUNT TYPE</span> : <span class="info-value">IDFC VISHESH</span>
            </div>
            <div class="info-row">
              <span class="info-label">CURRENCY</span> : <span class="info-value">INR</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Box -->
      <div class="summary-box" style="margin: 6px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 25%; border: 1px solid #333; padding: 3px 6px; background: #f0f0f0; font-weight: bold; font-size: 6.5px;">OPENING BALANCE</td>
            <td style="width: 25%; border: 1px solid #333; padding: 3px 6px; background: #fff; text-align: right; font-size: 6.5px;">${formatAmount(details.startingBalance)}</td>
            <td style="width: 25%; border: 1px solid #333; padding: 3px 6px; background: #f0f0f0; font-weight: bold; font-size: 6.5px;">TOTAL DEBITS</td>
            <td style="width: 25%; border: 1px solid #333; padding: 3px 6px; background: #fff; text-align: right; font-size: 6.5px;">${formatAmount(totalDebit)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px 6px; background: #f0f0f0; font-weight: bold; font-size: 6.5px;">CLOSING BALANCE</td>
            <td style="border: 1px solid #333; padding: 3px 6px; background: #fff; text-align: right; font-size: 6.5px;">${formatAmount(closingBalance)}</td>
            <td style="border: 1px solid #333; padding: 3px 6px; background: #f0f0f0; font-weight: bold; font-size: 6.5px;">TOTAL CREDITS</td>
            <td style="border: 1px solid #333; padding: 3px 6px; background: #fff; text-align: right; font-size: 6.5px;">${formatAmount(totalCredit)}</td>
          </tr>
        </table>
      </div>

      <!-- Transaction Table -->
      <table class="transaction-table" style="width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 6.5px;">
        <thead>
          <tr style="background: #f0f0f0; border: 1px solid #333;">
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: center; font-size: 6.5px; font-weight: bold; width: 10%;">Transaction<br/>Date</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: center; font-size: 6.5px; font-weight: bold; width: 10%;">Value Date</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: left; font-size: 6.5px; font-weight: bold; width: 42%;">Particulars</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: center; font-size: 6.5px; font-weight: bold; width: 8%;">Cheque<br/>No</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: right; font-size: 6.5px; font-weight: bold; width: 12%;">Debit</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: right; font-size: 6.5px; font-weight: bold; width: 12%;">Credit</th>
            <th style="border: 1px solid #333; padding: 3px 4px; text-align: right; font-size: 6.5px; font-weight: bold; width: 13%;">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: center;"></td>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: center;"></td>
            <td style="border: 1px solid #333; padding: 2px 4px; font-weight: bold;">Opening Balance</td>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: center;"></td>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: right;"></td>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: right;"></td>
            <td style="border: 1px solid #333; padding: 2px 4px; text-align: right;">${formatAmount(details.startingBalance)}</td>
          </tr>
          ${transactionRows}
        </tbody>
      </table>

      <!-- Footer -->
      <div style="margin-top: 8px; font-size: 5.5px; line-height: 1.3; border-top: 1px solid #000; padding-top: 4px;">
        <div style="font-size: 6px; font-weight: bold; margin-bottom: 2px;">REGISTERED OFFICE:</div>
        <div>IDFC FIRST BANK LIMITED, KRM Tower, 7th Floor, No. 1, Harrington Road, Chetpet, Chennai-600031, Tamilnadu, INDIA.</div>
        <div style="margin-top: 3px;">
          <strong>Customer Service No:</strong> 1800 2000 1066/1800 1234 222<br/>
          <strong>E-mail:</strong> customerservice@idfcfirstbank.com<br/>
          <strong>Website:</strong> www.idfcfirstbank.com
        </div>
      </div>

      <!-- Page Number -->
      <div style="text-align: right; font-size: 7px; margin-top: 6px;">Page 1 of 4</div>
    </body>
  </html>`;
};

export default renderIdfcTemplate;
