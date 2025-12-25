import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatKotakDate = (value: string) => format(new Date(value), 'dd/MM/yyyy');

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Kotak Mahindra Bank logo - Official SVG embedded
const buildKotakLogo = () => `
  <svg width="230" height="36" viewBox="0 0 300 90.192" xmlns="http://www.w3.org/2000/svg">
    <g fill-rule="evenodd">
      <!-- Blue circle background -->
      <path d="M0 45.096C0 20.192 23.474 0 52.434 0s52.432 20.192 52.432 45.096-23.474 45.096-52.432 45.096S0 70.003 0 45.096" fill="#003874"/>
      <!-- Red elements and text -->
      <g fill="#faf5f5ff">
        <path d="M46.067 14.483l12.182-4.025.06 65.853-12.285 4.116.044-65.944m126.716 56.682c11.707 0 20.623-6.808 20.623-18.524 0-11.78-8.916-18.6-20.623-18.6-11.7 0-20.617 6.8-20.617 18.6 0 11.717 8.916 18.524 20.617 18.524zm0-8.578c-5.646 0-7.957-4.7-7.957-9.946 0-5.315 2.3-10 7.957-10s7.963 4.694 7.963 10c0 5.246-2.3 9.946-7.963 9.946m19.498-19.14h7v14.44c0 8.44 2.654 13.278 13.606 13.278 3.063 0 5.38-.4 7.7-.68l-.4-7.966c-1.224.203-2.517.475-3.74.475-3.88 0-4.903-2.18-4.903-6.47V43.447h8.575v-8.58h-8.575l-.003-12.27-12.038 4.3v7.97h-7.214v8.58m70.7 26.903h12.25V52.78h.134l9.802 17.57H300l-13.34-19.205 12.316-16.276h-13.403l-10.208 14.914h-.134v-27.14L262.98 26.9v43.46"/>
        <path d="M119.55 70.35h12.254V52.78h.134l9.802 17.57h14.833l-13.34-19.205L155.55 34.87h-13.403L131.94 49.784h-.134v-27.14l-12.254 4.04V70.35m139.08.165c-.553-2.823-.7-5.65-.7-8.478v-13.37c0-10.96-7.923-14.9-17.082-14.9-5.302 0-9.918.756-14.324 2.55l.2 8.407c3.438-1.927 7.435-2.7 11.43-2.7 4.478 0 8.125 1.312 8.194 6.205a36.35 36.35 0 0 0-5.783-.481c-6.6 0-18.524 1.312-18.524 12.27 0 7.788 6.336 11.3 13.428 11.3 5.096 0 8.538-2 11.364-6.477H247c0 1.86.206 3.722.275 5.65h11.367zm-25.004-11.37c0-3.448 3.307-4.756 7.507-4.756 1.86 0 3.654.137 5.234.206 0 4.206-2.96 8.475-7.64 8.475-2.895 0-5.1-1.446-5.1-3.925"/>
      </g>
      <!-- White infinity symbol -->
      <path d="M91.866 49.636c-1.143 9.42-6.427 18.937-17.965 18.955-6.736.012-11.998-4.6-15.642-10.243v-6.536c4.56 2.264 8.822 4.694 13.993 4.768 6.37.094 12.13-2.355 14.512-6.945h5.103zm-38.57 5.915c-5.293 6.38-10.408 12.897-19.992 12.897-13.537 0-19.958-13.088-19.958-24.03 0-10.514 5.018-22.96 18.206-22.96 5.72 0 11.226 3.498 14.508 7.198l-.01 8.925c-2.742-1.846-8.884-3.657-12.894-3.722-8.363-.14-15.736 3.485-15.608 11.74.087 5.683 5.718 9.546 11.32 9.546 8.58 0 13.778-7.838 18.122-13.787a490.38 490.38 0 0 0 5.165-6.858c4.825-6.742 10.408-12.897 19.992-12.897 11.29 0 17.628 9.1 19.42 18.468h-5.1c-2.05-3.038-5.993-4.897-9.877-4.897-8.87 0-14.17 8.16-18.606 14.168l-4.7 6.208" fill="#fff"/>
    </g>
  </svg>
`;

export const renderKotakTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);

  const openingBalance = details.startingBalance;
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : details.startingBalance;

  const tableRows = transactions
    .map((txn, index) => {
      const amount = txn.credit > 0 ? txn.credit : txn.debit;
      const drCr = txn.credit > 0 ? 'CR' : 'DR';
      const balanceDrCr = txn.balance >= 0 ? 'CR' : 'DR';
      
      // Format UPI transactions with line break after "/To:" for better readability
      let formattedDescription = txn.description;
      if (formattedDescription.includes('UPI/') && formattedDescription.includes('/To:')) {
        formattedDescription = formattedDescription.replace('/To:', '<br/>/To:');
      }
      
      return `
        <tr>
          <td class="center">${index + 1}</td>
          <td class="center">${formatKotakDate(txn.date)}</td>
          <td>${formattedDescription}</td>
          <td class="center">${txn.reference || ''}</td>
          <td class="numeric">${formatAmount(amount)}</td>
          <td class="center">${drCr}</td>
          <td class="numeric">${formatAmount(Math.abs(txn.balance))}</td>
          <td class="center">${balanceDrCr}</td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Kotak Mahindra Bank Statement</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 10px;
          color: #000;
          line-height: 1.4;
        }
        @page { 
          margin: 0;
          size: A4;
        }
        
        /* Red header banner */
        .header {
          background: #E31E24;
          padding: 20px 40px;
          text-align: center;
        }
        
        .logo-container {
          display: inline-block;
        }
        
        /* Account Statement title */
        .statement-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 20px 0 15px 0;
          color: #000;
        }
        
        /* Main content area */
        .content {
          padding: 0 40px 40px 40px;
        }
        
        /* Two-column layout for customer info */
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 10px;
        }
        
        .customer-address {
          width: 45%;
          line-height: 1.6;
        }
        
        .account-details {
          width: 50%;
        }
        
        .account-details table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .account-details td {
          padding: 3px 0;
          border: none;
        }
        
        .account-details td:first-child {
          font-weight: normal;
          width: 140px;
        }
        
        .account-details td:last-child {
          font-weight: bold;
        }
        
        /* Transaction table */
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 9px;
        }
        
        .transaction-table th {
          background: #666666;
          color: white;
          padding: 8px 4px;
          text-align: left;
          font-weight: bold;
          font-size: 8.5px;
          border: 1px solid #666666;
        }
        
        .transaction-table td {
          padding: 6px 4px;
          border: 1px solid #CCCCCC;
          vertical-align: top;
        }
        
        .transaction-table tbody tr:nth-child(odd) {
          background: #FFFFFF;
        }
        
        .transaction-table tbody tr:nth-child(even) {
          background: #F5F5F5;
        }
        
        .transaction-table .col-sl { width: 30px; text-align: center; }
        .transaction-table .col-date { width: 70px; text-align: center; }
        .transaction-table .col-desc { width: auto; }
        .transaction-table .col-ref { width: 110px; text-align: center; }
        .transaction-table .col-amount { width: 80px; text-align: right; }
        .transaction-table .col-type { width: 35px; text-align: center; }
        .transaction-table .col-balance { width: 90px; text-align: right; }
        
        /* Balance summary */
        .balance-summary {
          margin-top: 25px;
          font-size: 10px;
          line-height: 1.8;
        }
        
        .balance-summary div {
          margin-bottom: 5px;
        }
        
        /* Footer */
        .footer {
          text-align: center;
          font-size: 9px;
          color: #333;
          margin-top: 40px;
          padding: 20px 40px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <!-- Red header with logo -->
      <div class="header">
        <div class="logo-container">
          ${buildKotakLogo()}
        </div>
      </div>
      
      <!-- Account Statement title -->
      <div class="statement-title">Account Statement</div>
      
      <!-- Main content -->
      <div class="content">
        <!-- Customer info and account details in two columns -->
        <div class="info-section">
          <div class="customer-address">
            <strong>${details.name}</strong><br/>
            ${details.address || 'Customer Address'}<br/>
            ${details.city || 'City'}<br/>
            ${details.state || 'State'}<br/>
            INDIA<br/>
            ${details.pincode || '110001'}
          </div>
          
          <div class="account-details">
            <table>
              <tr>
                <td>Cust. Reln. No.</td>
                <td>${statement.id}</td>
              </tr>
              <tr>
                <td>Account No.</td>
                <td>${details.accountNumber}</td>
              </tr>
              <tr>
                <td>Period</td>
                <td>From ${formatKotakDate(startDate)} To ${formatKotakDate(endDate)}</td>
              </tr>
              <tr>
                <td>Currency</td>
                <td>INR</td>
              </tr>
              <tr>
                <td>Branch</td>
                <td>${details.branch || details.bankName || 'DELHI BRANCH'}</td>
              </tr>
              <tr>
                <td>Nomination Regd</td>
                <td>N</td>
              </tr>
              <tr>
                <td>Nominee Name</td>
                <td></td>
              </tr>
              <tr>
                <td>IFSC</td>
                <td>${details.ifsc}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <!-- Transaction table -->
        <table class="transaction-table">
          <thead>
            <tr>
              <th class="col-sl">Sl. No.</th>
              <th class="col-date">Date</th>
              <th class="col-desc">Description</th>
              <th class="col-ref">Chq / Ref number</th>
              <th class="col-amount">Amount</th>
              <th class="col-type">Dr / Cr</th>
              <th class="col-balance">Balance</th>
              <th class="col-type">Dr / Cr</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <!-- Balance summary -->
        <div class="balance-summary">
          <div>
            <strong>Opening balance</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            as on ${formatKotakDate(startDate)} &nbsp; INR ${formatAmount(openingBalance)}
          </div>
          <div>
            <strong>Closing balance</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            as on ${formatKotakDate(endDate)} &nbsp; INR ${formatAmount(closingBalance)}
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        You may call our 24-hour Customer Contact Centre at our number 1860 266 2666<br/>
        Write to us at Customer Contact Centre, Kotak Mahindra Bank Ltd., Post Box Number 16344, Mumbai 400 013
      </div>
    </body>
  </html>`;
};

export default renderKotakTemplate;
