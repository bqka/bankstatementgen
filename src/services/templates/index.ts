import { Statement } from '@/types/statement';
import { renderIciciTemplate } from './icici';
import { renderSbiTemplate } from './sbi';
import { renderPnbTemplate } from './pnb';
import { renderKotakTemplate } from './kotak';
import { renderHdfcTemplate } from './hdfc';
import { renderAxisTemplate } from './axis';
import { renderIdfcTemplate } from './idfc';
import { renderIndusindTemplate } from './indusind';
import { renderCbiTemplate } from './cbi';
import { renderYesTemplate } from './yes';
import { renderBobTemplate } from './bob';
import { renderUcoTemplate } from './uco';
import { renderIobTemplate } from './iob';
import { renderCanaraTemplate } from './canara';
import { renderUnionTemplate } from './union';

type TemplateMap = Record<string, (statement: Statement) => Promise<string> | string>;

const templateRenderers: TemplateMap = {
  ICICI: (statement) => renderIciciTemplate(statement),
  SBI: (statement) => renderSbiTemplate(statement),
  PNB: (statement) => renderPnbTemplate(statement),
  KOTAK: (statement) => renderKotakTemplate(statement),
  HDFC: (statement) => renderHdfcTemplate(statement),
  AXIS: (statement) => renderAxisTemplate(statement),
  IDFC: (statement) => renderIdfcTemplate(statement),
  INDUSIND: (statement) => renderIndusindTemplate(statement),
  CBI: (statement) => renderCbiTemplate(statement),
  YES: (statement) => renderYesTemplate(statement),
  BOB: (statement) => renderBobTemplate(statement),
  UCO: (statement) => renderUcoTemplate(statement),
  IOB: (statement) => renderIobTemplate(statement),
  CANARA: (statement) => renderCanaraTemplate(statement),
  UNION: (statement) => renderUnionTemplate(statement)
};

const fallbackRenderer = async (statement: Statement, template: string) => {
  const transactionRows = statement.transactions
    .map(
      (txn) => `
        <tr>
          <td>${txn.date}</td>
          <td>${txn.description}</td>
          <td>${txn.reference}</td>
          <td>${txn.debit.toFixed(2)}</td>
          <td>${txn.credit.toFixed(2)}</td>
          <td>${txn.balance.toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #0e2a47; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #d0d5dd; padding: 8px; font-size: 12px; }
          th { background-color: #f0f4ff; text-align: left; }
          h1 { font-size: 22px; }
        </style>
      </head>
      <body>
        <h1>${statement.details.bankName} Statement (${template})</h1>
        <p>Name: ${statement.details.name}</p>
        <p>Account: ${statement.details.accountNumber}</p>
        <p>IFSC: ${statement.details.ifsc}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Ref No</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows}
          </tbody>
        </table>
      </body>
    </html>`;
};

export const renderTemplate = async (statement: Statement) => {
  const template = statement.meta.template;
  const renderer = templateRenderers[template];

  if (renderer) {
    return await renderer(statement);
  }

  return fallbackRenderer(statement, template);
};
