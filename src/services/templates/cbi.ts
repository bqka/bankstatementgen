import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatCbiDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd/MM/yyyy');
};

const formatCbiDateTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, "eee MMM dd HH:mm:ss 'IST' yyyy");
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatAmountWithSuffix = (value: number, suffix: string) =>
  `${formatAmount(value)} ${suffix}`;

const formatBalanceWithSuffix = (value: number) =>
  `${formatAmount(Math.abs(value))} ${value >= 0 ? 'CR' : 'DR'}`;

const splitReference = (reference?: string) => {
  if (!reference) {
    return { branch: '-', cheque: '-' };
  }

  const sanitized = reference.replace(/\s+/g, ' ').trim();
  const parts = sanitized.split(/[\s/|-]+/).filter(Boolean);

  return {
    branch: parts[0] || reference,
    cheque: parts[1] || '-',
  };
};

// Central Bank of India official logo (SVG supplied)
const buildCbiLogo = () => `
  <div style="width: 220px;">
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1266 323" width="100%" height="auto">
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
          <path d="m-1165.23-3932.32h3456.69v4533.42h-3456.69z"/>
        </clipPath>
      </defs>
      <style>
        .s0 { fill: #176fc1 }
        .s1 { fill: #ffffff }
        .s2 { fill: #ce0f3e }
      </style>
      <g clip-path="url(#cp1)">
        <path class="s0" d="m0.9 322.1h320.1v-322.2h-320.1z"/>
        <path class="s0" d="m329.2 0.6h936.7v321.5h-936.7z"/>
        <path class="s1" d="m30.7 292.1h260.5v-262.2h-260.5z"/>
        <path class="s2" d="m263.1 159.3v39.2h-33.9l-45.9 46.3-22.3 22.4h-34.4v-34.6l-67.7-70.4v-35.8h35l46.6-49.4 19.9-21 36.7-0.1v36.4zm-28.7-0.2l-38.4-39.4-12.6 0.1-20.6 0.2v6.1l20.6-0.1h12.3l34.7 33.6zm-14.2 38.3l-0.3-33.4h-5.9v33.1l-30.6 31.6-19.7 20.2 0.6 4 19.1-18.9zm-56.8 34.6l0.6 4 19.3-19 19.8-19.6-0.3-33.4h-5.9v33.1l-13.6 14.3zm-1.8-37.3l21.6-21.2 11.8-11.6-11.8-12.5-20.3-21.5-22.5 22-10.9 10.8 10.9 11.5zm-0.7 26.5v-6l-20.5 0.1h-12.4l-51.5-50.5-4 0.6 55.3 56.1 12.6-0.1zm-71.6-56.1l38.4 39.4 12.7-0.2 20.5-0.2v-6h-20.5-12.4l-34.7-33.6zm70.3-76.8l-19.3 19-19.8 19.6 0.3 33.3h5.9v-33.1l13.6-14.2 19.8-20.6zm-56.1 38.6l0.2 33.4h6v-33.2l30.7-31.5 19.5-20.2-0.5-4-19 18.8zm147.5 32.1l-55.2-56.2-12.6 0.2-20.6 0.1v6h20.6l12.3-0.1 51.6 50.5z"/>
      </g>
    </svg>
  </div>
`;

export const renderCbiTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);
  const openingBalance = details.startingBalance;
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : openingBalance;

  const statementDateTime = formatCbiDateTime(meta.generatedAt);
  const statementPeriod = `${formatCbiDate(startDate)} to ${formatCbiDate(endDate)}`;

  const addressLines = [
    details.address,
    [details.city, details.state].filter(Boolean).join(', '),
    details.pincode ? `PIN: ${details.pincode}` : undefined,
  ]
    .filter(Boolean)
    .join('<br />');

  const branchLines = [
    details.branch,
    [details.city, details.state].filter(Boolean).join(', '),
    details.pincode,
  ]
    .filter(Boolean)
    .join('<br />');

  const productType = meta.userType === 'salaried' ? 'Salary Account' : 'Current Account';

  const transactionRows = transactions.length
    ? transactions
        .map((txn) => {
          const { branch, cheque } = splitReference(txn.reference);
          return `
            <tr>
              <td class="cell-center">${formatCbiDate(txn.date)}</td>
              <td class="cell-center">${formatCbiDate(txn.date)}</td>
              <td class="cell-center">${branch}</td>
              <td class="cell-center">${cheque}</td>
              <td class="cell-description">${txn.description}</td>
              <td class="cell-numeric">${txn.debit > 0 ? formatAmountWithSuffix(txn.debit, 'DR') : ''}</td>
              <td class="cell-numeric">${txn.credit > 0 ? formatAmountWithSuffix(txn.credit, 'CR') : ''}</td>
              <td class="cell-numeric">${formatBalanceWithSuffix(txn.balance)}</td>
            </tr>
          `;
        })
        .join('')
    : `
        <tr>
          <td colspan="8" class="cell-description" style="text-align:center; padding:14px;">No transactions available for the selected period.</td>
        </tr>
      `;

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Central Bank of India - Account Statement</title>
      <style>
        @page { margin: 0.7cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 10px;
          line-height: 1.4;
          color: #0f172a;
          background: #ffffff;
        }

        .wrapper {
          padding: 20px 28px 32px;
        }

        .top-banner {
          display: flex;
          gap: 18px;
          align-items: stretch;
          margin-bottom: 20px;
        }

        .banner-left {
          background: #176fc1;
          color: #ffffff;
          padding: 14px 18px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 260px;
        }

        .logo-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .banner-text {
          text-align: center;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1.3;
        }

        .banner-tagline {
          margin-top: 12px;
          background: #ce0f3e;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 600;
          text-align: center;
        }

        .banner-tagline span {
          display: block;
          font-size: 8px;
          font-weight: 500;
        }

        .banner-right {
          flex: 1;
          background: #f2f6ff;
          border: 1px solid #c6d4f2;
          border-radius: 8px;
          padding: 16px 20px;
        }

        .bank-title {
          font-size: 18px;
          font-weight: 700;
          color: #0b3f91;
          text-align: right;
          margin-bottom: 6px;
          letter-spacing: 0.06em;
        }

        .bank-meta {
          font-size: 10px;
          text-align: right;
          color: #1f2937;
          line-height: 1.5;
        }

        .bank-meta strong {
          font-weight: 700;
        }

        .section-divider {
          margin: 18px 0;
          border-top: 1px solid #d8dee9;
        }

        .customer-meta {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .info-block {
          background: #fdfdfd;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 14px 16px;
        }

        .info-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0b1d51;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .address-block {
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          gap: 12px;
        }

        .info-label {
          font-weight: 600;
          color: #374151;
        }

        .info-value {
          color: #1f2937;
          text-align: right;
          flex: 1;
        }

        .statement-highlights {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .highlight {
          border: 1px solid #d1d9ee;
          border-radius: 6px;
          padding: 10px 12px;
          background: #f8faff;
        }

        .highlight-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .highlight-value {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .transactions-section {
          margin-top: 10px;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          border: 1px solid #cbd5e1;
        }

        .transaction-table thead th {
          background: #e0e7ff;
          border: 1px solid #cbd5e1;
          padding: 6px 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0b1d51;
          font-size: 9px;
          text-align: center;
        }

        .transaction-table tbody td {
          border: 1px solid #d1d5db;
          padding: 6px 4px;
          vertical-align: top;
        }

        .transaction-table tbody tr:nth-child(even) {
          background: #f6f8fc;
        }

        .cell-center {
          text-align: center;
          white-space: nowrap;
        }

        .cell-description {
          text-align: left;
          min-width: 200px;
        }

        .cell-numeric {
          text-align: right;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .footer-note {
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px solid #d1d5db;
          font-size: 9px;
          color: #4b5563;
          text-align: center;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="top-banner">
          <div class="banner-left">
            <div class="logo-wrapper">
              ${buildCbiLogo()}
            </div>
            <div class="banner-text">
              Central Bank of India
            </div>
            <div class="banner-tagline">
              1911 से आपकी सेवा में
              <span>CENTRAL - To You Since 1911</span>
            </div>
          </div>
          <div class="banner-right">
            <div class="bank-title">Central Bank of India</div>
            <div class="bank-meta">
              ${branchLines || 'Registered Office - Mumbai'}<br />
              <strong>Branch:</strong> ${details.branch || 'Main Branch'}<br />
              <strong>IFSC Code:</strong> ${details.ifsc}<br />
              <strong>Account Number:</strong> ${details.accountNumber}<br />
              <strong>Product Type:</strong> ${productType}
            </div>
          </div>
        </div>

        <div class="customer-meta">
          <div class="info-block">
            <div class="info-title">Customer Information</div>
            <div class="address-block">
              <strong>${details.name}</strong><br />
              ${addressLines || 'Address not provided'}
            </div>
            <div class="info-row">
              <span class="info-label">Account Number</span>
              <span class="info-value">${details.accountNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${details.email || 'Not Available'}</span>
            </div>
          </div>
          <div class="info-block">
            <div class="info-title">Statement Details</div>
            <div class="info-row">
              <span class="info-label">Statement Date</span>
              <span class="info-value">${statementDateTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cleared Balance</span>
              <span class="info-value">${formatBalanceWithSuffix(closingBalance)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Uncleared Amount</span>
              <span class="info-value">${formatAmountWithSuffix(0, 'CR')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Drawing Power</span>
              <span class="info-value">${formatAmountWithSuffix(0, 'CR')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Statement of Account</span>
              <span class="info-value">${statementPeriod}</span>
            </div>
          </div>
        </div>

        <div class="statement-highlights">
          <div class="highlight">
            <div class="highlight-label">Opening Balance</div>
            <div class="highlight-value">${formatBalanceWithSuffix(openingBalance)}</div>
          </div>
          <div class="highlight">
            <div class="highlight-label">Closing Balance</div>
            <div class="highlight-value">${formatBalanceWithSuffix(closingBalance)}</div>
          </div>
          <div class="highlight">
            <div class="highlight-label">Total Credits</div>
            <div class="highlight-value">${formatAmountWithSuffix(
              transactions.reduce((sum, txn) => sum + txn.credit, 0),
              'CR'
            )}</div>
          </div>
          <div class="highlight">
            <div class="highlight-label">Total Debits</div>
            <div class="highlight-value">${formatAmountWithSuffix(
              transactions.reduce((sum, txn) => sum + txn.debit, 0),
              'DR'
            )}</div>
          </div>
        </div>

        <div class="transactions-section">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Post Date</th>
                <th>Value Date</th>
                <th>Branch Code</th>
                <th>Cheque Number</th>
                <th>Account Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${transactionRows}
            </tbody>
          </table>
        </div>

        <div class="footer-note">
          This is a computer generated statement and does not require a signature.<br />
          For any inquiries, please reach out to Central Bank of India Customer Care.
        </div>
      </div>
    </body>
  </html>`;
};