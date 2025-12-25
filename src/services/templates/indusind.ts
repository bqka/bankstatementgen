import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatIndusindDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd MMM yyyy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const renderIndusindTemplate = (statement: Statement) => {
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
  <td style="font-size: 9px; vertical-align: top;">${formatIndusindDate(txn.date)}</td>
  <td style="font-size: 9px; vertical-align: top; word-break: break-word;">${txn.description}</td>
  <td style="font-size: 9px; text-align: left; vertical-align: top;">${(txn as any).chequeNo || txn.reference || ''}</td>
  <td style="font-size: 9px; text-align: right; vertical-align: top;">${txn.debit > 0 ? formatAmount(txn.debit) : '0.00'}</td>
  <td style="font-size: 9px; text-align: right; vertical-align: top;">${txn.credit > 0 ? formatAmount(txn.credit) : '0.00'}</td>
  <td style="font-size: 9px; text-align: right; vertical-align: top;">${formatAmount(txn.balance)}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>IndusInd Bank - Account Statement</title>
      <style>
        @page { margin: 0.5cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          line-height: 1.4;
          color: #000;
          background: #fff;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .statement-badge {
          background: #e74c3c;
          color: white;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 12px;
          border-radius: 4px;
        }

        .bank-logo {
          color: #98272a;
          font-size: 20px;
          font-weight: 700;
          font-style: italic;
        }

        .customer-info {
          margin-bottom: 20px;
          font-size: 10px;
          line-height: 1.6;
        }

        .customer-info .name {
          font-weight: 700;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .section-title {
          font-weight: 700;
          font-size: 11px;
          margin: 16px 0 8px 0;
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
        }

        .info-table {
          width: 100%;
          margin-bottom: 16px;
        }

        .info-table td {
          padding: 6px;
          border: 1px solid #ddd;
          font-size: 10px;
        }

        .info-table td.label {
          background: #f5e6e6;
          font-weight: 600;
          width: 30%;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }

        .summary-table th,
        .summary-table td {
          padding: 8px 6px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 10px;
        }

        .summary-table th {
          background: #f5e6e6;
          font-weight: 600;
        }

        .transaction-section {
          margin-top: 20px;
        }

        .transaction-header {
          font-weight: 700;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .transaction-meta {
          background: #f9f9f9;
          padding: 8px;
          margin-bottom: 8px;
          font-size: 10px;
          border: 1px solid #ddd;
        }

        .transaction-meta strong {
          font-weight: 700;
        }

        .transaction-table-wrapper {
          border: 1px solid #c93d3a;
          border-radius: 12px;
          padding: 0;
          margin-top: 16px;
          overflow: hidden;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          page-break-inside: auto;
        }

        .transaction-table tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        .transaction-table th {
          background: #fbe5e2;
          color: #a6231f;
          padding: 10px 8px;
          border-bottom: 1px solid #c93d3a;
          border-right: 1px solid #f1d5d2;
          font-weight: 600;
          font-size: 9px;
          text-align: left;
        }

        .transaction-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #f1d5d2;
          border-right: 1px solid #f1d5d2;
          font-size: 9px;
          vertical-align: top;
          color: #3a3a3a;
        }

        .transaction-table td:last-child,
        .transaction-table th:last-child {
          border-right: none;
        }

        .transaction-table tr:last-child td {
          border-bottom: none;
        }

        .transaction-table tbody tr:nth-child(even) td {
          background: #fff7f6;
        }

        .footer-section {
          margin-top: 24px;
          font-size: 9px;
          color: #3a3a3a;
          line-height: 1.5;
        }

        .footer-section p {
          margin-bottom: 8px;
        }

        .footer-section .footer-note {
          font-style: italic;
        }

        .footer-section .footer-heading {
          margin-top: 20px;
          margin-bottom: 6px;
          font-weight: 700;
          text-align: center;
        }

        .footer-section .footer-link {
          color: #0b51c5;
          text-decoration: none;
          text-align: center;
          display: block;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="statement-badge">
          Account Statement<br/>
          ${details.accountNumber}
        </div>
        <div class="bank-logo">IndusInd Bank</div>
      </div>

      <div class="customer-info">
        <div class="name">${details.name || 'ABHINAV .'}</div>
        ${details.address ? details.address.split('\n').map(line => `<div>${line}</div>`).join('') : '<div>BHARAT FINANCIAL INCLUSION LIMITED, BAJAJ TOWER</div><div>PLOT NO 2-3 2ND FLOOR NEAR SUJEET, AUTO AGENCY</div><div>BERASIA ROAD,</div><div>BHOPAL,</div><div>MADHYA PRADESH 462023</div><div>INDIA</div>'}
        <div style="margin-top: 8px;">Mob No / Tel: ${(details as any).phone || '+91-9302259269'}</div>
      </div>

      <div class="section-title">Relationship Summary for Customer ID - ${(details as any).customerId || '64046971'}</div>

      <div class="section-title" style="font-size: 10px; border-bottom: 1px solid #000;">Customer Details</div>
      <table class="info-table">
        <tr>
          <td class="label">Name</td>
          <td class="label">Holding Status</td>
          <td class="label">Customer ID</td>
        </tr>
        <tr>
          <td>${details.name || 'ABHINAV .'}</td>
          <td>Primary Holder</td>
          <td>${(details as any).customerId || '64046971'}</td>
        </tr>
      </table>

      <div class="section-title" style="font-size: 10px; border-bottom: 1px solid #000;">Account Summary</div>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Account No.</th>
            <th>Account Type</th>
            <th>Currency</th>
            <th>Lien Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${details.accountNumber}</td>
            <td>${(details as any).accountType || 'INDUS COMFORT MAXIMA'}</td>
            <td>INR</td>
            <td>0</td>
            <td>${formatAmount(closingBalance)}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title" style="font-size: 10px; border-bottom: 1px solid #000;">Transaction History</div>

      <table class="info-table">
        <tr>
          <td class="label">Account Number</td>
          <td>${details.accountNumber}</td>
          <td class="label">Name</td>
          <td>${details.name || 'ABHINAV .'}</td>
          <td class="label">Customer ID</td>
          <td>${(details as any).customerId || '64046971'}</td>
        </tr>
      </table>

      <div class="transaction-meta">
        <strong>Product Description:</strong> ${(details as any).productDescription || 'INDUS COMFORT MAXIMA'}<br/>
        <strong>PAN:</strong> ${(details as any).pan || 'FORM 60/61'}<br/>
        <strong>Statement Period:</strong> ${formatIndusindDate(startDate)} - ${formatIndusindDate(endDate)}<br/>
        <strong>Nomination Registered:</strong> ${(details as any).nominationStatus || 'Yes'}<br/>
        <strong>Email for e E Statement:</strong> ${(details as any).email || 'Rspcatabhinav2004@gmail.com'}<br/>
        <strong>Mobile No for SMS Alerts:</strong> ${(details as any).phone || '+91 9302259269'}<br/>
        <strong>Branch IFSC Code:</strong> ${details.ifsc || 'IN030002091'}
      </div>

      <div class="transaction-table-wrapper">
        <table class="transaction-table">
          <thead>
            <tr>
              <th style="width: 12%;">Date</th>
              <th style="width: 35%;">Particulars</th>
              <th style="width: 15%;">Chq No/Ref No</th>
              <th style="width: 13%; text-align: right;">Withdrawal</th>
              <th style="width: 13%; text-align: right;">Deposit</th>
              <th style="width: 12%; text-align: right;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows}
          </tbody>
        </table>
      </div>

      <div class="footer-section">
        <p>This is a computer generated statement and does not require signature. For any queries or details on our products &amp; services, please call our Phones Banking Numbers: 1860-267-7777 (within INDIA) and +91 22 4406 6666 (Outside India) or write to us at &#39;reachus@indusind.com&#39; or visit us at www.indusind.com.</p>
        <p>Service Tax Registration Number AAACT3116GST001. *Any discrepancies in this statement may kindly be brought to the notice of the bank within seven days.</p>
        <p class="footer-note">*This is a computer generated statement and so valid without signature.</p>
        <p>Registered office: INDUSIND BANK LTD, 2401, General Thimmayya Road (Cantonment), Maharashtra Pune - 411001. Corporate Identity Number (CIN): L65191PN1994PLC076333.</p>
        <p>Acronyms: MICR - Magnetic Ink Character recognition, IFSC - Indian Financial System Code, NEFT - National Electronic Fund Transfer, RTGS - Real Time Gross Settlement, ECS - Electronic Clearance Service, TDS - Tax Deduction at Source, IMPS - Immediate Payment Service, MMID - Mobile Money Identification Number, POS - Point of Sale, TXN - Transaction, ATM - Automated Teller Machine, PG - Payment Gateway, GST - Goods and Services Tax.</p>
        <div class="footer-heading">Grievance Officer details</div>
        <a class="footer-link" href="https://www.indusind.com/content/dam/regulatoryDisclosure/grievanceRedressal/grievance-redressal-mechanism.pdf">https://www.indusind.com/content/dam/regulatoryDisclosure/grievanceRedressal/grievance-redressal-mechanism.pdf</a>
      </div>
    </body>
  </html>`;
};