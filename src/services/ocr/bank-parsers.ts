/**
 * Bank Statement Parsers
 * Extracts specific fields from different bank statement formats
 */

interface ParsedBankData {
  name?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  branchAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneNumber?: string;
  email?: string;
  micr?: string;
  startingBalance?: number;
  endingBalance?: number;
  statementPeriod?: string;
}

/**
 * Parse SBI Bank Statement
 * Format: Account Name, Address, Account Number, CIF, MICR, IFS Code
 */
export const parseSBIStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'State Bank of India' };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Account Name (after "Account Name" label)
  const nameMatch = text.match(/Account\s+Name\s*[:\-]?\s*[:\s]*([A-Z\s.]+?)(?:\n|Address)/i);
  if (nameMatch) {
    result.name = nameMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract Address (after "Address" label, before Account Number)
  const addressMatch = text.match(/Address\s*[:\-]?\s*[:\s]*(.+?)(?=\n.*?(?:Account\s+Number|Date|jahangirabad))/is);
  if (addressMatch) {
    const fullAddress = addressMatch[1].trim().replace(/\s+/g, ' ');
    result.branchAddress = fullAddress;
    
    // Extract city from address
    const cityMatch = fullAddress.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-,]?\s*\d{6}/i);
    if (cityMatch) {
      result.city = cityMatch[1].trim();
    }
    
    // Extract pincode
    const pincodeMatch = fullAddress.match(/\b(\d{6})\b/);
    if (pincodeMatch) {
      result.pincode = pincodeMatch[1];
    }
  }

  // Extract Account Number
  const accountMatch = text.match(/Account\s+Number\s*[:\-]?\s*[:\s]*(\d{10,18})/i);
  if (accountMatch) {
    result.accountNumber = accountMatch[1].trim();
  }

  // Extract IFSC (IFS Code)
  const ifscMatch = text.match(/(?:IFS\s+Code|IFSC)\s*[:\-]?\s*[:\s]*([A-Z]{4}0[A-Z0-9]{6})/i);
  if (ifscMatch) {
    result.ifsc = ifscMatch[1].trim();
  }

  // Extract Branch Name
  const branchMatch = text.match(/Branch\s*[:\-]?\s*[:\s]*([A-Z\s,]+?)(?=\n|Drawing\s+Power|Interest)/i);
  if (branchMatch) {
    result.branchName = branchMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract MICR Code
  const micrMatch = text.match(/MICR\s+(?:Code|Number)\s*[:\-]?\s*[:\s]*(\d{9})/i);
  if (micrMatch) {
    result.micr = micrMatch[1];
  }

  // Extract CIF Number (can be used as phone or additional info)
  const cifMatch = text.match(/CIF\s+No\.?\s*[:\-]?\s*[:\s]*(\d+)/i);
  if (cifMatch) {
    // Store in phoneNumber field as fallback
    result.phoneNumber = cifMatch[1];
  }

  // Extract CKYCR Number (appears after CIF No.)
  const ckucrMatch = text.match(/CKYCR\s+Number\s*[:\-]?\s*[:\s]*([X\d]+)/i);
  if (ckucrMatch) {
    // Store CKYCR if found (typically XXXXXXXXXX3776 format)
    // Can be stored in additional metadata if needed
  }

  // Extract Balance
  const balanceMatch = text.match(/Balance\s+as\s+on.*?[:\-]?\s*[:\s]*([\d,]+\.?\d*)/i);
  if (balanceMatch) {
    result.endingBalance = parseFloat(balanceMatch[1].replace(/,/g, ''));
  }

  // Extract Statement Period
  const periodMatch = text.match(/(?:Account\s+Statement\s+from|Statement\s+From)\s+(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})\s+to\s+(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/i);
  if (periodMatch) {
    result.statementPeriod = `${periodMatch[1]} to ${periodMatch[2]}`;
  }

  return result;
};

/**
 * Parse HDFC Bank Statement
 * Format: Customer name in box, Account Branch, Address, City, State, Phone, Email
 */
export const parseHDFCStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'HDFC Bank' };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Customer Name (usually in upper section, before "MR" or inside box)
  const nameMatch = text.match(/(?:MR|MS|MRS|DR)\.?\s+([A-Z\s]+?)(?=\n|\d{4}\s+[A-Z])/i);
  if (nameMatch) {
    result.name = nameMatch[0].trim().replace(/\s+/g, ' ');
  }

  // Extract Account Number
  const accountMatch = text.match(/Account\s+No\.?\s*[:\-]?\s*[:\s]*(\d{10,18})/i);
  if (accountMatch) {
    result.accountNumber = accountMatch[1].trim();
  }

  // Extract IFSC (RTGS/NEFT IFSC)
  const ifscMatch = text.match(/(?:RTGS.*?IFSC|NEFT.*?IFSC|IFSC)\s*[:\-]?\s*[:\s]*([A-Z]{4}0[A-Z0-9]{6})/is);
  if (ifscMatch) {
    result.ifsc = ifscMatch[1].trim();
  }

  // Extract Branch Code
  const branchCodeMatch = text.match(/Branch\s+Code\s*[:\-]?\s*[:\s]*(\d{4})/i);
  if (branchCodeMatch) {
    result.branchName = `Branch Code: ${branchCodeMatch[1]}`;
  }

  // Extract Account Branch
  const branchMatch = text.match(/Account\s+Branch\s*[:\-]?\s*[:\s]*([A-Z\s]+?)(?=\n|Address)/i);
  if (branchMatch) {
    result.branchName = branchMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract Address (multi-line, typically after account holder name)
  const addressMatch = text.match(/(\d{3,4}\s+[A-Z][A-Z\s,]+?(?:COLONY|PLAZA|ROAD|NAGAR|VIHAR)[A-Z\s,]*?)(?=\n.*?(?:City|State|Phone))/is);
  if (addressMatch) {
    result.branchAddress = addressMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract City
  const cityMatch = text.match(/City\s*[:\-]?\s*[:\s]*([A-Z\s]+?)(?=\n|State)/i);
  if (cityMatch) {
    result.city = cityMatch[1].trim();
  }

  // Extract State
  const stateMatch = text.match(/State\s*[:\-]?\s*[:\s]*([A-Z\s]+?)(?=\n|Phone)/i);
  if (stateMatch) {
    result.state = stateMatch[1].trim();
  }

  // Extract Phone Number
  const phoneMatch = text.match(/Phone\s+no\.?\s*[:\-]?\s*[:\s]*(\d{10,12})/i);
  if (phoneMatch) {
    result.phoneNumber = phoneMatch[1].trim();
  }

  // Extract Email
  const emailMatch = text.match(/Email\s*[:\-]?\s*[:\s]*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
  if (emailMatch) {
    result.email = emailMatch[1].toLowerCase();
  }

  // Extract MICR
  const micrMatch = text.match(/MICR\s*[:\-]?\s*[:\s]*(\d{9})/i);
  if (micrMatch) {
    result.micr = micrMatch[1];
  }

  // Extract Customer ID (Cust ID)
  const custIdMatch = text.match(/Cust\s+ID\s*[:\-]?\s*[:\s]*(\d+)/i);
  if (custIdMatch && !result.phoneNumber) {
    result.phoneNumber = custIdMatch[1]; // Use as fallback
  }

  // Extract Statement Period
  const periodMatch = text.match(/Statement\s+From\s*[:\-]?\s*[:\s]*(\d{2}\/\d{2}\/\d{4})\s+To\s*[:\-]?\s*[:\s]*(\d{2}\/\d{2}\/\d{4})/i);
  if (periodMatch) {
    result.statementPeriod = `${periodMatch[1]} to ${periodMatch[2]}`;
  }

  return result;
};

/**
 * Parse AXIS Bank Statement
 */
export const parseAXISStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Axis Bank' };

  result.name = text.match(/(?:MR|MS|MRS)\.?\s+([A-Z\s]+?)(?=\n|\d{4})/i)?.[1]?.trim().replace(/\s+/g, ' ');
  result.accountNumber = text.match(/Account\s+No\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/(?:IFSC|IFS)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/(?:Branch|Account Branch)\s*[:\-]?\s*([A-Z\s]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n|State)/i)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:Phone|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.email = text.match(/Email\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();

  return result;
};

/**
 * Parse Bank of Baroda (BOB) Statement
 */
export const parseBOBStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Bank of Baroda' };

  result.name = text.match(/(?:Name|Customer Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/(?:Account|A\/C)\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|IFSC)/i)?.[1]?.trim();
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*\d{6}/is)?.[1]?.trim();
  result.pincode = text.match(/\b(\d{6})\b/)?.[1];
  result.email = text.match(/(?:Email|E-mail)\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();

  return result;
};

/**
 * Parse Canara Bank Statement
 */
export const parseCanaraStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Canara Bank' };

  result.name = text.match(/(?:Name|Account Holder)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n|State|\d{6})/i)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.pincode = text.match(/(?:PIN|Pincode)\s*[:\-]?\s*(\d{6})/i)?.[1] || text.match(/\b(\d{6})\b/)?.[1];
  result.phoneNumber = text.match(/(?:Phone|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];

  return result;
};

/**
 * Parse Central Bank of India (CBI) Statement
 */
export const parseCBIStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Central Bank of India' };

  result.name = text.match(/(?:Name|Account Holder)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/(?:Account|A\/C)\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/(?:IFSC|IFS)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.micr = text.match(/MICR\s*[:\-]?\s*(\d{9})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+)\s*(?:,|\d{6})/is)?.[1]?.trim();
  result.pincode = text.match(/(?:PIN|Pincode)\s*[:\-]?\s*(\d{6})/i)?.[1];
  result.phoneNumber = text.match(/(?:Phone|Tel|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];

  return result;
};

/**
 * Parse ICICI Bank Statement
 */
export const parseICICIStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'ICICI Bank' };

  result.name = text.match(/(?:MR|MS|MRS)\.?\s+([A-Z\s]+?)(?=\n|Account)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:Phone|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.email = text.match(/Email\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();

  return result;
};

/**
 * Parse IDFC First Bank Statement
 */
export const parseIDFCStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'IDFC First Bank' };

  result.name = text.match(/(?:Name|Customer Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:PHONE NO|Mobile)\s*[:\-]?\s*\*+(\d{4})/i)?.[1] ? `*******${text.match(/\*+(\d{4})/)?.[1]}` : undefined;
  result.email = text.match(/Email\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+)\s*/is)?.[1]?.trim();

  return result;
};

/**
 * Parse IndusInd Bank Statement
 */
export const parseIndusIndStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'IndusInd Bank' };

  result.name = text.match(/(?:Customer Name|Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Customer ID)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:Mobile|Phone)\s*[:\-]?\s*(\d{10,12})/i)?.[1];

  return result;
};

/**
 * Parse Indian Overseas Bank (IOB) Statement
 */
export const parseIOBStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Indian Overseas Bank' };

  result.name = text.match(/(?:ACCOUNT HOLDER NAME|Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|CUSTOMER ID)/i)?.[1]?.trim();
  result.accountNumber = text.match(/(?:ACCOUNT NUMBER|Account No)\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/(?:IFSC CODE|IFSC)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/(?:BRANCH NAME|Branch)\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|BRANCH CODE)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:MOBILE NUMBER|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+)\s*/is)?.[1]?.trim();
  result.pincode = text.match(/\b(\d{6})\b/)?.[1];

  return result;
};

/**
 * Parse Kotak Mahindra Bank Statement
 */
export const parseKotakStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Kotak Mahindra Bank' };

  result.name = text.match(/(?:MR|MS|MRS)\.?\s+([A-Z\s]+?)(?=\n|\d{4})/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:Phone|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.email = text.match(/Email\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();

  return result;
};

/**
 * Parse Punjab National Bank (PNB) Statement
 */
export const parsePNBStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Punjab National Bank' };

  result.name = text.match(/(?:Name|Account Holder)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+)\s*/is)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.pincode = text.match(/\b(\d{6})\b/)?.[1];

  return result;
};

/**
 * Parse UCO Bank Statement
 */
export const parseUCOStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'UCO Bank' };

  result.name = text.match(/(?:CUSTOMER NAME|Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|CUSTOMER ID)/i)?.[1]?.trim();
  result.accountNumber = text.match(/(?:ACCOUNT NUMBER|Account No)\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/(?:IFSC CODE|IFSC)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/(?:BRANCH NAME|Branch)\s*[:\-]?\s*([A-Z\s,]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:MOBILE NO|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.email = text.match(/(?:EMAIL ID|Email)\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();
  result.city = text.match(/([A-Z][a-z]+)\s+Madhya/i)?.[1]?.trim() || text.match(/BHOPAL/i)?.[0];
  result.pincode = text.match(/\b(\d{6})\b/)?.[1];

  return result;
};

/**
 * Parse Union Bank of India Statement
 */
export const parseUnionStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'Union Bank of India' };

  result.name = text.match(/(?:Name|Account Holder)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/City\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.pincode = text.match(/\b(\d{6})\b/)?.[1];

  return result;
};

/**
 * Parse YES Bank Statement
 */
export const parseYESStatement = (text: string): ParsedBankData => {
  const result: ParsedBankData = { bankName: 'YES Bank' };

  result.name = text.match(/(?:Name|Customer Name)\s*[:\-]?\s*([A-Z\s.]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.accountNumber = text.match(/Account\s+(?:No|Number)\.?\s*[:\-]?\s*(\d{10,18})/i)?.[1];
  result.ifsc = text.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)?.[1];
  result.branchName = text.match(/Branch\s*[:\-]?\s*([A-Z\s,]+?)(?=\n|Address)/i)?.[1]?.trim();
  result.city = text.match(/(?:City|Branch).*?([A-Z][a-z]+)\s*/is)?.[1]?.trim();
  result.state = text.match(/State\s*[:\-]?\s*([A-Z\s]+?)(?=\n)/i)?.[1]?.trim();
  result.phoneNumber = text.match(/(?:Phone|Mobile)\s*[:\-]?\s*(\d{10,12})/i)?.[1];
  result.email = text.match(/Email\s*[:\-]?\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i)?.[1]?.toLowerCase();

  return result;
};

/**
 * Detect bank type from statement text
 */
export const detectBankType = (text: string): string => {
  const upperText = text.toUpperCase();
  
  if (upperText.includes('STATE BANK OF INDIA') || upperText.includes('SBI')) return 'SBI';
  if (upperText.includes('HDFC BANK') || upperText.includes('HDFC')) return 'HDFC';
  if (upperText.includes('AXIS BANK') || upperText.includes('AXIS')) return 'AXIS';
  if (upperText.includes('BANK OF BARODA') || upperText.includes('BOB')) return 'BOB';
  if (upperText.includes('CANARA BANK') || upperText.includes('CANARA')) return 'CANARA';
  if (upperText.includes('CENTRAL BANK OF INDIA') || upperText.includes('CENTRAL BANK')) return 'CBI';
  if (upperText.includes('ICICI BANK') || upperText.includes('ICICI')) return 'ICICI';
  if (upperText.includes('IDFC FIRST BANK') || upperText.includes('IDFC')) return 'IDFC';
  if (upperText.includes('INDUSIND BANK') || upperText.includes('INDUSIND')) return 'INDUSIND';
  if (upperText.includes('INDIAN OVERSEAS BANK') || upperText.includes('IOB')) return 'IOB';
  if (upperText.includes('KOTAK MAHINDRA') || upperText.includes('KOTAK')) return 'KOTAK';
  if (upperText.includes('PUNJAB NATIONAL BANK') || upperText.includes('PNB')) return 'PNB';
  if (upperText.includes('UCO BANK') || upperText.includes('UCO')) return 'UCO';
  if (upperText.includes('UNION BANK OF INDIA') || upperText.includes('UNION BANK')) return 'UNION';
  if (upperText.includes('YES BANK') || upperText.includes('YES')) return 'YES';
  
  return 'UNKNOWN';
};

/**
 * Parse bank statement based on detected bank type
 */
export const parseBankStatement = (text: string): ParsedBankData => {
  const bankType = detectBankType(text);
  
  switch (bankType) {
    case 'SBI': return parseSBIStatement(text);
    case 'HDFC': return parseHDFCStatement(text);
    case 'AXIS': return parseAXISStatement(text);
    case 'BOB': return parseBOBStatement(text);
    case 'CANARA': return parseCanaraStatement(text);
    case 'CBI': return parseCBIStatement(text);
    case 'ICICI': return parseICICIStatement(text);
    case 'IDFC': return parseIDFCStatement(text);
    case 'INDUSIND': return parseIndusIndStatement(text);
    case 'IOB': return parseIOBStatement(text);
    case 'KOTAK': return parseKotakStatement(text);
    case 'PNB': return parsePNBStatement(text);
    case 'UCO': return parseUCOStatement(text);
    case 'UNION': return parseUnionStatement(text);
    case 'YES': return parseYESStatement(text);
    default: return { bankName: 'Unknown Bank' };
  }
};
