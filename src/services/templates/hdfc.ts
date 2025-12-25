import { Statement } from '@/types/statement';
import { format } from 'date-fns';

const formatHdfcDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, 'dd/MM/yy');
};

const formatAmount = (value: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Build account details section
const buildAccountDetails = (details: Statement['details']) => `
  <div class="account-details">
    <div><span class="detail-label">Account Branch</span>: ${details.bankBranch || details.branch || details.bankName || 'CHUNA BHATTI'}</div>
    <div><span class="detail-label">Address</span>: ${details.address ? details.address.toUpperCase().replace(/\n/g, '<br/><span style="margin-left: 130px;">').replace(/,/g, '') : 'PLOT NO 44, PREM PLAZA<br/><span style="margin-left: 130px;">AMALTAS COLONY PHASE 1</span><br/><span style="margin-left: 130px;">CHUNNA BHATTI KOLAR ROAD</span><br/><span style="margin-left: 130px;">BHOPAL</span>'}</div>
    <div><span class="detail-label">City</span>: ${details.city || 'BHOPAL'}</div>
    <div><span class="detail-label">State</span>: ${details.state || 'MADHYA PRADESH'}</div>
    <div><span class="detail-label">Phone no.</span>: ${details.phoneNumber || '18002026161'}</div>
    <div><span class="detail-label">OD Limit</span>: 0 Currency : INR</div>
    <div><span class="detail-label">Email</span>: ${details.email || 'CUSTOMER@EMAIL.COM'}</div>
    <div><span class="detail-label">Cust ID</span>: 75883816</div>
    <div><span class="detail-label">Account No</span>: ${details.accountNumber} PRIME</div>
    <div><span class="detail-label">A/C Open Date</span>: 02/11/2017</div>
    <div><span class="detail-label">Account Status</span>: Regular</div>
    <div><span class="detail-label">RTGS/NEFT IFSC</span>: ${details.ifsc} MICR : 462240005</div>
    <div><span class="detail-label">Branch Code</span>: H58 Product Code : 161</div>
  </div>
`;

// HDFC Logo with tagline
const buildHdfcLogo = () => `
  <div style="margin-bottom: 15px;">
    <svg width="180" height="45" viewBox="0 0 289 70" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-227.317, -407.333)">
        <g transform="matrix(6.01697, 0, 0, -6.01697, -1957.41, 2763.93)">
          <!-- Blue background bars -->
          <path style="fill:#004c8f;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 363.272,391.479 47.722,0 0,-7.953 -47.722,0 0,7.953 z"/>
          <path style="fill:#004c8f;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 371.226,391.479 39.768,0 0,-7.953 -39.768,0 0,7.953 z"/>
          
          <!-- White letters: HDFC BANK -->
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 373.755,385.621 0,3.763 1.238,0 0,-1.27 1.16,0 0,1.27 1.24,0 0,-3.763 -1.24,0 0,1.46 -1.16,0 0,-1.46 -1.238,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 379.352,388.449 0.321,0 c 0.231,0 0.4,-0.024 0.508,-0.072 0.08,-0.035 0.145,-0.087 0.202,-0.165 0.052,-0.077 0.094,-0.174 0.125,-0.296 0.028,-0.121 0.043,-0.249 0.043,-0.384 0,-0.22 -0.03,-0.404 -0.095,-0.553 -0.063,-0.149 -0.154,-0.256 -0.271,-0.322 -0.117,-0.067 -0.291,-0.099 -0.521,-0.099 l -0.312,-0.002 0,1.893 z m 0.478,-2.828 0,0 c 0.292,0 0.534,0.024 0.732,0.077 0.199,0.051 0.361,0.119 0.485,0.2 0.126,0.083 0.24,0.195 0.345,0.334 0.104,0.144 0.195,0.325 0.266,0.547 0.073,0.221 0.108,0.47 0.108,0.752 0,0.414 -0.079,0.764 -0.239,1.056 -0.162,0.286 -0.382,0.493 -0.663,0.615 -0.28,0.122 -0.614,0.182 -1.002,0.182 l -1.721,0 0,-3.763 1.689,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 382.333,385.621 0,3.763 2.936,0 0,-0.928 -1.714,0 0,-0.603 1.371,0 0,-0.903 -1.371,0 0,-1.329 -1.222,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 389.415,387.945 -1.169,0 c -0.022,0.187 -0.09,0.335 -0.203,0.441 -0.114,0.104 -0.257,0.155 -0.433,0.155 -0.219,0 -0.397,-0.085 -0.534,-0.253 -0.138,-0.17 -0.207,-0.445 -0.207,-0.823 0,-0.264 0.031,-0.462 0.088,-0.597 0.059,-0.139 0.142,-0.239 0.245,-0.306 0.106,-0.067 0.235,-0.098 0.394,-0.098 0.19,0 0.342,0.048 0.453,0.158 0.114,0.103 0.18,0.257 0.202,0.463 l 1.19,0 c -0.026,-0.234 -0.073,-0.43 -0.141,-0.59 -0.065,-0.159 -0.181,-0.317 -0.338,-0.476 -0.159,-0.161 -0.349,-0.285 -0.568,-0.371 -0.219,-0.087 -0.472,-0.128 -0.762,-0.128 -0.286,0 -0.553,0.041 -0.794,0.125 -0.244,0.086 -0.45,0.208 -0.614,0.361 -0.167,0.159 -0.297,0.337 -0.39,0.538 -0.134,0.283 -0.197,0.594 -0.197,0.941 0,0.29 0.047,0.565 0.142,0.817 0.095,0.25 0.226,0.463 0.393,0.635 0.168,0.171 0.351,0.299 0.555,0.385 0.258,0.11 0.542,0.163 0.857,0.163 0.274,0 0.528,-0.04 0.768,-0.121 0.239,-0.081 0.435,-0.199 0.588,-0.356 0.155,-0.157 0.274,-0.337 0.357,-0.542 0.06,-0.143 0.098,-0.316 0.118,-0.521"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 393.38,388.537 c 0.175,0 0.288,-0.008 0.344,-0.024 0.072,-0.021 0.132,-0.062 0.175,-0.116 0.044,-0.056 0.067,-0.121 0.067,-0.196 0,-0.096 -0.038,-0.175 -0.111,-0.235 -0.078,-0.063 -0.211,-0.092 -0.402,-0.092 l -0.466,0 0,0.663 0.393,0 z m 0.311,-2.916 0,0 c 0.293,0 0.499,0.014 0.62,0.04 0.119,0.028 0.242,0.072 0.367,0.13 0.122,0.064 0.216,0.124 0.278,0.19 0.096,0.089 0.167,0.197 0.219,0.327 0.052,0.131 0.078,0.279 0.078,0.438 0,0.227 -0.056,0.414 -0.17,0.566 -0.114,0.153 -0.267,0.254 -0.46,0.309 0.327,0.206 0.49,0.472 0.49,0.796 0,0.335 -0.144,0.591 -0.429,0.765 -0.22,0.134 -0.563,0.202 -1.028,0.202 l -1.867,0 0,-3.763 1.902,0 z m -0.199,1.576 0,0 c 0.245,0 0.404,-0.03 0.484,-0.093 0.074,-0.061 0.114,-0.145 0.114,-0.258 0,-0.114 -0.04,-0.204 -0.121,-0.267 -0.077,-0.067 -0.238,-0.095 -0.477,-0.095 l -0.505,0 0,0.713 0.505,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 397.972,386.886 -0.787,0 0.388,1.369 0.399,-1.369 z m -1.157,-1.265 0,0 0.143,0.494 1.232,0 0.144,-0.494 1.231,0 -1.35,3.763 -1.257,0 -1.351,-3.763 1.208,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 400.085,385.621 0,3.763 1.153,0 1.301,-2.015 0,2.015 1.186,0 0,-3.763 -1.178,0 -1.273,1.965 0,-1.965 -1.189,0"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 404.55,385.621 0,3.763 1.199,0 0,-1.241 1.119,1.241 1.454,0 -1.379,-1.417 1.522,-2.346 -1.482,0 -0.905,1.499 -0.329,-0.325 0,-1.174 -1.199,0"/>
          
          <!-- Red square with white border and cross -->
          <path style="fill:#ed232a;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 363.272,391.479 7.953,0 0,-7.953 -7.953,0 0,7.953 z"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 364.664,390.087 5.17,0 0,-5.17 -5.17,0 0,5.17 z"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 366.851,391.479 0.795,0 0,-7.953 -0.795,0 0,7.953 z"/>
          <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 363.272,387.899 7.953,0 0,-0.795 -7.953,0 0,0.795 z"/>
          <path style="fill:#004c8f;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 366.056,388.695 2.386,0 0,-2.386 -2.386,0 0,2.386 z"/>
        </g>
      </g>
    </svg>
  </div>
`;

export const renderHdfcTemplate = (statement: Statement) => {
  const { details, transactions, meta } = statement;
  
  // Use period dates from meta if available, otherwise calculate from transactions
  const startDate = meta.statementPeriodStart ?? (transactions[0]?.date ?? meta.generatedAt);
  const endDate = meta.statementPeriodEnd ?? (transactions[transactions.length - 1]?.date ?? meta.generatedAt);

  const totalCredit = transactions.reduce((sum, txn) => sum + txn.credit, 0);
  const totalDebit = transactions.reduce((sum, txn) => sum + txn.debit, 0);
  const closingBalance = transactions.length
    ? transactions[transactions.length - 1].balance
    : details.startingBalance;

  // Split transactions into pages (approximately 25 transactions per page)
  const TRANSACTIONS_PER_PAGE = 16;
  const pages: typeof transactions[] = [];
  for (let i = 0; i < transactions.length; i += TRANSACTIONS_PER_PAGE) {
    pages.push(transactions.slice(i, i + TRANSACTIONS_PER_PAGE));
  }
  
  // If no transactions, create empty page
  if (pages.length === 0) {
    pages.push([]);
  }

  const totalPages = pages.length + 1; // +1 for summary page

  // Generate transaction rows for each page
  const generateTransactionRows = (pageTransactions: typeof transactions) => {
    return pageTransactions
      .map(
        (txn) => `
        <tr>
          <td class="date-cell">${formatHdfcDate(txn.date)}</td>
          <td class="narration-cell">${txn.description}</td>
          <td class="ref-cell">${txn.reference || ''}</td>
          <td class="date-cell">${formatHdfcDate(txn.date)}</td>
          <td class="amount-cell">${txn.debit > 0 ? formatAmount(txn.debit) : ''}</td>
          <td class="amount-cell">${txn.credit > 0 ? formatAmount(txn.credit) : ''}</td>
          <td class="amount-cell">${formatAmount(Math.abs(txn.balance))}</td>
        </tr>
      `
      )
      .join('');
  };

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>HDFC Bank - Account Statement</title>
      <style>
        @page { margin: 0.8cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
          font-family: Arial, sans-serif;
          font-size: 8pt;
          line-height: 1.3;
          color: #000;
          background: #fff;
          padding: 15px;
        }

        /* Page header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
          font-size: 8pt;
        }

        .page-number {
          text-align: left;
        }

        .statement-title-header {
          text-align: right;
        }

        /* Header section with logo and details */
        .header-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .left-section {
          flex: 0 0 48%;
        }

        .right-section {
          flex: 0 0 48%;
          padding-left: 20px;
        }

        /* Customer details box */
        .customer-box {
          border: 1px solid #000;
          padding: 8px;
          margin-bottom: 5px;
          font-size: 8pt;
          line-height: 1.4;
          min-height: 100px;
        }

        .customer-name {
          font-weight: bold;
          margin-bottom: 3px;
        }

        .nomination {
          font-size: 8pt;
          margin-top: 5px;
        }

        /* Account details on right */
        .account-details {
          font-size: 8pt;
          line-height: 1.5;
        }

        .account-details div {
          margin-bottom: 2px;
        }

        .detail-label {
          display: inline-block;
          width: 130px;
        }

        .statement-period {
          margin: 10px 0 8px 0;
          font-size: 8pt;
          font-weight: normal;
        }

        /* Transaction table styling */
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 8pt;
        }

        /* Table styling */
        .transactions-table {
          background-color: #E6F3F3; /* Light mint green background for entire table */
          border: 1px solid rgba(0,0,0,0.1);
        }

        /* Table header */
        .transactions-table thead th {
          border: 1px solid rgba(0,0,0,0.1);
          padding: 4px 3px;
          font-weight: bold;
          font-size: 8pt;
          text-align: left;
          vertical-align: middle;
        }

        /* Table cells */
        .transactions-table td {
          border: none; /* Remove borders from body cells */
          border-right: 1px solid rgba(0,0,0,0.1); /* Very light separator between columns */
          padding: 3px 4px;
          vertical-align: top;
          font-size: 8pt;
          line-height: 1.2;
        }

        /* Remove right border from last cell in each row */
        .transactions-table td:last-child {
          border-right: none;
        }

        /* Cell types */
        .date-cell {
          text-align: center;
          white-space: nowrap;
        }

        .narration-cell {
          text-align: left;
          word-break: break-word;
        }

        .ref-cell {
          text-align: left;
          word-break: break-word;
        }

        .amount-cell {
          text-align: right;
          white-space: nowrap;
        }

        /* Footer styling */
        .footer-section {
          margin-top: 15px;
        }

        .bank-name-footer {
          color: #004c8f;
          font-size: 9pt;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .disclaimer {
          font-size: 7pt;
          line-height: 1.4;
          color: #000;
          margin-bottom: 3px;
        }

        .branch-info {
          font-size: 7pt;
          line-height: 1.4;
          margin-top: 5px;
        }

        /* Last page summary styling */
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 8pt;
        }

        .summary-table thead th {
          border: 1px solid #000;
          padding: 6px 8px;
          font-weight: bold;
          text-align: center;
          font-size: 8pt;
        }

        .summary-table tbody td {
          border: 1px solid #000;
          padding: 6px 8px;
          text-align: center;
          font-size: 8pt;
        }

        .summary-label {
          text-align: center !important;
          font-weight: normal;
        }

        .generation-info {
          font-size: 8pt;
          margin: 20px 0;
          line-height: 1.6;
        }

        .generation-info-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .generation-info-line span:first-child {
          font-weight: bold;
        }

        .computer-statement {
          text-align: right;
          font-size: 8pt;
          margin: 40px 0 20px 0;
          line-height: 1.4;
        }

        .summary-table td {
          border: 1px solid rgba(0,0,0,0.1);
          padding: 5px;
          text-align: right;
        }

        .summary-label {
          text-align: left !important;
          font-weight: normal;
        }

        .generation-info {
          font-size: 8pt;
          margin: 15px 0;
          line-height: 1.5;
        }

        .computer-statement {
          text-align: right;
          font-size: 8pt;
          margin-top: 30px;
        }

        /* Page break for printing */
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      ${pages.map((pageTransactions, pageIndex) => `
      <!-- Page ${pageIndex + 1} -->
      <div class="page-break">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-number">Page No. : ${pageIndex + 1}</div>
          <div class="statement-title-header">Statement of account</div>
        </div>

        <!-- Header Section (Logo and Account Details) -->
        <div class="header-section">
          <div class="left-section">
            ${buildHdfcLogo()}
            
            <div class="customer-box">
              <div class="customer-name">MR ${details.name.toUpperCase()}</div>
              <div>${details.address ? details.address.toUpperCase().replace(/\n/g, '<br/>') : '3824 AYODHYA BY PASS NEAR BY<br/>MARGHAT PANCHVATI COLONY FACE 3<br/>KAROND LAMBA KHEDA<br/>BHOPAL 462038<br/>MADHYA PRADESH'}</div>
              <div style="margin-top: 8px;">JOINT HOLDERS :</div>
            </div>
            
            <div class="nomination">Nomination : Registered</div>
          </div>

          <div class="right-section">
            ${buildAccountDetails(details)}
          </div>
        </div>

        <div class="statement-period">
          Statement From : ${formatHdfcDate(startDate)} To : ${formatHdfcDate(endDate)}
        </div>

        <table class="transactions-table">
          <thead>
            <tr>
              <th style="width: 8%;">Date</th>
              <th style="width: 40%;">Narration</th>
              <th style="width: 15%;">Chq./Ref.No.</th>
              <th style="width: 8%;">Value Dt</th>
              <th style="width: 11%;">Withdrawal Amt.</th>
              <th style="width: 11%;">Deposit Amt.</th>
              <th style="width: 12%;">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            ${generateTransactionRows(pageTransactions)}
          </tbody>
        </table>

        <!-- Footer Section -->
        <div class="footer-section">
          <div class="bank-name-footer">HDFC BANK LIMITED</div>
          <div class="disclaimer">
            * Closing balance includes funds earmarked for hold and uncleared funds<br/>
            Contents of this statement will be considered correct if no error is reported within 60 days of receipt of statement. The address on this statement is that on record with the Bank as at the day of requesting this statement.
          </div>
          <div class="branch-info">
            State account branch GSTN:23AAACH2702H1Z8<br/>
            HDFC Bank GSTIN number details are available at https://www.hdfcbank.com/personal/making-payments/online-tax-payment/goods-and-service-tax.<br/>
            Registered Office Address: HDFC Bank House,Senapati Bapat Marg,Lower Parel,Mumbai 400013
          </div>
        </div>
      </div>
      `).join('')}

      <!-- Last Page with Summary -->
      <div class="page-break">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-number">Page No. : ${totalPages}</div>
          <div class="statement-title-header">Statement of account</div>
        </div>

        <!-- Header Section (Logo and Account Details) -->
        <div class="header-section">
          <div class="left-section">
            ${buildHdfcLogo()}
            
            <div class="customer-box">
              <div class="customer-name">MR ${details.name.toUpperCase()}</div>
              <div>${details.address ? details.address.toUpperCase().replace(/\n/g, '<br/>') : '3824 AYODHYA BY PASS NEAR BY<br/>MARGHAT PANCHVATI COLONY FACE 3<br/>KAROND LAMBA KHEDA<br/>BHOPAL 462038<br/>MADHYA PRADESH'}</div>
              <div style="margin-top: 8px;">JOINT HOLDERS :</div>
            </div>
            
            <div class="nomination">Nomination : Registered</div>
          </div>

          <div class="right-section">
            ${buildAccountDetails(details)}
          </div>
        </div>

        <div class="statement-period">
          Statement From : ${formatHdfcDate(startDate)} To : ${formatHdfcDate(endDate)}
        </div>

        <!-- Summary Table -->
        <table class="summary-table">
          <thead>
            <tr>
              <th>Opening Balance</th>
              <th>Dr Count</th>
              <th>Cr Count</th>
              <th>Debits</th>
              <th>Credits</th>
              <th>Closing Bal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="summary-label">${formatAmount(details.startingBalance)}</td>
              <td>${transactions.filter(t => t.debit > 0).length}</td>
              <td>${transactions.filter(t => t.credit > 0).length}</td>
              <td>${formatAmount(totalDebit)}</td>
              <td>${formatAmount(totalCredit)}</td>
              <td>${formatAmount(closingBalance)}</td>
            </tr>
          </tbody>
        </table>

        <div class="generation-info">
          <div class="generation-info-line">
            <span>Generated On: ${format(new Date(meta.generatedAt), 'dd-MMM-yyyy HH:mm:ss')}</span>
            <span style="margin-left: auto; padding-left: 50px;">Generated By: ${meta.generatedBy || '75883916'}</span>
            <span style="margin-left: 50px;">Requesting Branch Code: ${details.ifsc.slice(-4) || '1058'}</span>
          </div>
        </div>

        <div class="computer-statement">
          This is a computer generated statement and does<br/>
          not require signature.
        </div>

        <!-- Footer Section -->
        <div class="footer-section">
          <div class="bank-name-footer">HDFC BANK LIMITED</div>
          <div class="disclaimer">
            * Closing balance includes funds earmarked for hold and uncleared funds<br/>
            Contents of this statement will be considered correct if no error is reported within 30 days of receipt of statement.The address on this statement is that on record with the Bank as at the day of requesting this statement.
          </div>
          <div class="branch-info">
            State account branch GSTN:23AAACH2702H1Z8<br/>
            HDFC Bank GSTIN number details are available at https://www.hdfcbank.com/personal/making-payments/online-tax-payment/goods-and-service-tax.<br/>
            Registered Office Address: HDFC Bank House,Senapati Bapat Marg,Lower Parel,Mumbai 400013
          </div>
        </div>
      </div>
    </body>
  </html>`;
};

export default renderHdfcTemplate;
