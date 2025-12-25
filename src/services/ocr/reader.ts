import * as FileSystem from 'expo-file-system';
import { Transaction } from '@/types/statement';
import { parseBankStatement, detectBankType } from './bank-parsers';

// Note: Tesseract.js removed - not compatible with React Native
// Using cloud OCR API instead

// Helper to detect file type from URI
const getFileTypeFromUri = (uri: string): 'image' | 'pdf' | 'unknown' => {
  const lowercaseUri = uri.toLowerCase();
  
  if (lowercaseUri.endsWith('.pdf')) {
    return 'pdf';
  }
  
  if (lowercaseUri.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
    return 'image';
  }
  
  return 'unknown';
};

// Helper function to convert file URI to base64 for Tesseract
const getFileAsBase64 = async (uri: string): Promise<string> => {
  try {
    console.log('Reading file from URI:', uri);
    
    // Validate URI
    if (!uri || uri.trim() === '') {
      throw new Error('Invalid file URI');
    }

    let base64: string;

    // For file:// URIs, read the file directly
    if (uri.startsWith('file://')) {
      console.log('Reading as file:// URI');
      base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      // For other URIs (like content://), try to copy to cache directory first
      console.log('Copying to cache directory for processing');
      const fileName = uri.split('/').pop() || `temp_${Date.now()}.jpg`;
      const cacheUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.copyAsync({
        from: uri,
        to: cacheUri,
      });

      console.log('Reading from cache:', cacheUri);
      base64 = await FileSystem.readAsStringAsync(cacheUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Clean up cache file
      try {
        await FileSystem.deleteAsync(cacheUri, { idempotent: true });
        console.log('Cache file cleaned up');
      } catch (cleanupError) {
        console.warn('Cache cleanup warning:', cleanupError);
      }
    }
    
    // Validate base64 output
    if (!base64 || base64.trim() === '') {
      throw new Error('File read resulted in empty data');
    }
    
    // Check if base64 is valid
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64.substring(0, 100))) {
      throw new Error('Invalid base64 data format');
    }
    
    console.log(`Successfully read file: ${base64.length} characters`);
    return base64;
    
  } catch (error) {
    console.error('Error reading file:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Unable to read the selected file: ${errorMsg}. Please ensure the file is accessible and try again.`);
  }
};

// Helper function to create image data URL from base64
const createImageDataUrl = (base64: string, mimeType: string = 'image/jpeg'): string => {
  return `data:${mimeType};base64,${base64}`;
};

// Helper function to process image with OCR using cloud API
// NOTE: Tesseract.js v5 is NOT compatible with React Native due to Web Workers requirement
// Using OCR.space free API as fallback (works in React Native/Expo)
const processImageWithOCR = async (imageDataUrl: string, base64: string, mimeType: string): Promise<string> => {
  console.log('Running cloud OCR (OCR.space API)...');
  
  try {
    // Prepare form data for OCR.space API
    const formData = new FormData();
    formData.append('base64Image', imageDataUrl);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

    console.log('Sending image to OCR.space API...');
    
    // Call OCR.space free API
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'K87899142388957', // Free tier API key (public, rate-limited)
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('OCR API response received');

    // Check for API errors
    if (result.IsErroredOnProcessing) {
      const errorMessage = result.ErrorMessage?.[0] || 'Unknown OCR error';
      throw new Error(`OCR processing failed: ${errorMessage}`);
    }

    // Extract text from response
    const text = result.ParsedResults?.[0]?.ParsedText || '';
    console.log(`OCR completed. Extracted text length: ${text.length}`);
    
    if (!text.trim()) {
      throw new Error('No text extracted from image. Please ensure the image is clear, well-lit, and contains readable text.');
    }
    
    return text;

  } catch (error) {
    console.error('OCR processing error:', error);
    
    if (error instanceof Error && error.message.includes('Network request failed')) {
      throw new Error('OCR failed: No internet connection. Please check your network and try again.');
    }
    
    throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the image is clear and try again.`);
  }
};

/**
 * Process PDF files and extract text from all pages
 * Uses PDF.js configured for React Native (no worker)
 */
const processPdfFile = async (uri: string): Promise<{ text: string; pages: string[]; pageLines: string[][] }> => {
  console.log('Processing PDF file...');
  
  try {
    // Import PDF.js utilities
    const { loadPdfDocument } = await import('./pdfjs');
    
    // Read PDF as base64
    console.log('Reading PDF file...');
    const base64 = await getFileAsBase64(uri);
    
    if (!base64 || base64.length < 100) {
      throw new Error('PDF file is empty or corrupted');
    }
    
    console.log('Loading PDF document...');
    const pdf = await loadPdfDocument(base64) as any;
    
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    
    const pages: string[] = [];
    const pageLines: string[][] = [];
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Extracting text from page ${pageNum}/${pdf.numPages}...`);
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items into a single string
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      pages.push(pageText);
      pageLines.push(pageText.split('\n').map((line: string) => line.trim()).filter(Boolean));
      
      console.log(`Page ${pageNum} extracted: ${pageText.length} characters`);
    }
    
    // Combine all pages
    const fullText = pages.join('\n\n');
    
    console.log(`PDF processing complete. Total text length: ${fullText.length} characters`);
    
    return {
      text: fullText,
      pages,
      pageLines,
    };
    
  } catch (error) {
    console.error('PDF processing failed:', error);
    throw new Error(
      `Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      'If the problem persists, try converting the PDF to an image format (JPG/PNG) and try again.'
    );
  }
};

// Helper function to safely pick neighboring lines
const getNextLines = (collection: string[], index: number, count: number): string[] => {
  const slice: string[] = [];
  for (let i = index + 1; i <= index + count && i < collection.length; i += 1) {
    slice.push(collection[i]);
  }
  return slice;
};

// Helper function to extract data from text lines
const extractDataFromText = (lines: string[], result: OcrResult, headerLines: string[]): void => {
  // Parse header lines specifically for branch/location metadata
  headerLines.forEach((raw, idx) => {
    const line = raw.trim();
    const lower = line.toLowerCase();

    if (!result.branchName) {
      const match = line.match(/branch\s*(?:name)?\s*[:\-]?\s*(.+)/i);
      if (match) {
        result.branchName = match[1].trim();
      }
    }

    if (!result.branchAddress && lower.includes('branch address')) {
      const afterLabel = line.split(/branch\s*address[:\-]*/i)[1]?.trim();
      if (afterLabel) {
        result.branchAddress = afterLabel;
      } else {
        const continuation = getNextLines(headerLines, idx, 2).join(', ').trim();
        if (continuation) {
          result.branchAddress = continuation;
        }
      }
    }

    if (!result.branchPhone && /phone/i.test(lower)) {
      const match = line.match(/phone\s*[:\-]?\s*([+0-9\s\-]+)/i);
      if (match) {
        result.branchPhone = match[1].replace(/\s{2,}/g, ' ').trim();
      }
    }

    if (!result.micr && /micr/i.test(lower)) {
      const match = line.match(/micr\s*(?:code)?\s*[:\-]?\s*(\d{9})/i);
      if (match) {
        result.micr = match[1];
      }
    }

    if (!result.statementPeriod && /period/i.test(lower)) {
      const match = line.match(/period\s*[:\-]?\s*([\d\/\-.]+)\s*(?:to|-|–|upto)\s*([\d\/\-.]+)/i);
      if (match) {
        result.statementPeriod = `${match[1].trim()} to ${match[2].trim()}`;
      }
    }

    if (!result.city && /city/i.test(lower)) {
      const match = line.match(/city\s*[:\-]?\s*(.+)/i);
      if (match) {
        result.city = match[1].trim();
      }
    }

    if (!result.state && /state/i.test(lower)) {
      const match = line.match(/state\s*[:\-]?\s*(.+)/i);
      if (match) {
        result.state = match[1].trim();
      }
    }

    if (!result.pincode && /pin|pincode|postal code/i.test(lower)) {
      const match = line.match(/(\d{6})/);
      if (match) {
        result.pincode = match[1];
      }
    }
  });

  if (result.branchAddress) {
    if (!result.pincode) {
      const pinMatch = result.branchAddress.match(/(\d{6})/);
      if (pinMatch) {
        result.pincode = pinMatch[1];
      }
    }
    if (!result.city || !result.state) {
      const parts = result.branchAddress.split(/,|\s{2,}/).map((part) => part.trim()).filter(Boolean);
      if (!result.state && parts.length >= 2) {
        result.state = parts[parts.length - 2];
      }
      if (!result.city && parts.length >= 1) {
        const lastPart = parts[parts.length - 1];
        result.city = lastPart.replace(/\d{6}/g, '').trim();
      }
    }
  }

  if (result.city) {
    result.city = result.city.replace(/\d{6}/g, '').replace(/[,;]$/, '').trim();
  }

  if (result.state) {
    result.state = result.state.replace(/\d{6}/g, '').replace(/[,;]$/, '').trim();
  }

  // Extract account details with enhanced regex patterns
  // Using best-practice patterns for Indian bank statements
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // IFSC Code Pattern: IFSC [:-]? [A-Z]{4}0[A-Z0-9]{6}
    // Example: IFSC: SBIN0001234 or IFSC - HDFC0001234
    if (!result.ifsc) {
      const ifscMatch = line.match(/IFSC\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i);
      if (ifscMatch) {
        result.ifsc = ifscMatch[1].toUpperCase();
        console.log('✓ IFSC extracted:', result.ifsc);
      } else {
        // Alternative: Just look for IFSC code pattern anywhere in line
        const ifscAlt = line.match(/\b([A-Z]{4}0[A-Z0-9]{6})\b/i);
        if (ifscAlt && /ifsc|branch\s*code/i.test(lowerLine)) {
          result.ifsc = ifscAlt[1].toUpperCase();
          console.log('✓ IFSC extracted (alt):', result.ifsc);
        }
      }
    }

    // Account Number Pattern: Account Number [:-]? \d{9,18}
    // Example: Account Number: 1234567890123 or Acc No - 98765432109
    if (!result.accountNumber) {
      const accMatch = line.match(/Account\s*(?:Number|No\.?|#)\s*[:\-]?\s*(\d{9,18})/i);
      if (accMatch) {
        result.accountNumber = accMatch[1];
        console.log('✓ Account Number extracted:', result.accountNumber);
      } else {
        // Alternative: Look for account number keywords followed by digits
        if (/acc(?:ount)?\s*(?:no|number|#)/i.test(lowerLine)) {
          const accAlt = line.match(/(\d{9,18})/);
          if (accAlt) {
            result.accountNumber = accAlt[1];
            console.log('✓ Account Number extracted (alt):', result.accountNumber);
          }
        }
      }
    }

    // Name Pattern: Name [:-]? [A-Za-z\s]+
    // Example: Name: John Doe or Customer: Jane Smith
    if (!result.name) {
      const nameMatch = line.match(/(?:Name|Customer(?:\s+Name)?|Account\s+Holder)\s*[:\-]?\s*([A-Za-z\s\.]{3,})/i);
      if (nameMatch) {
        let extractedName = nameMatch[1].trim();
        // Clean up common artifacts
        extractedName = extractedName.replace(/\b(Mr|Mrs|Ms|Dr|Prof)\.?\s*/gi, '');
        extractedName = extractedName.replace(/\s+/g, ' ').trim();
        
        // Only accept names with at least 3 characters
        if (extractedName.length >= 3) {
          result.name = extractedName;
          console.log('✓ Name extracted:', result.name);
        }
      }
    }

    // Branch Name Pattern: Branch [:-]? [\w\s]+
    // Example: Branch: Mumbai Central or Branch Name - Delhi South
    if (!result.branchName) {
      const branchMatch = line.match(/Branch(?:\s+Name)?\s*[:\-]?\s*([\w\s]+?)(?:\s*(?:IFSC|Account|Address|$))/i);
      if (branchMatch) {
        let branchName = branchMatch[1].trim();
        // Remove common trailing words
        branchName = branchName.replace(/\s*(?:Branch|Location|Office)\s*$/i, '');
        
        if (branchName.length >= 3) {
          result.branchName = branchName;
          console.log('✓ Branch Name extracted:', result.branchName);
        }
      }
    }

    // Branch Address (keep existing logic)
    if (!result.branchAddress && /address/i.test(lowerLine)) {
      const addressMatch = line.match(/Address\s*[:\-]?\s*(.+)/i);
      if (addressMatch) {
        result.branchAddress = addressMatch[1].trim();
        console.log('✓ Address extracted:', result.branchAddress);
      }
    }

    if (!result.branchPhone && /phone|tel|contact/i.test(lines[i])) {
      const match = lines[i].match(/(?:phone|tel|contact)\s*[:\-]?\s*([+0-9\s\-()]+)/i);
      if (match) {
        result.branchPhone = match[1].replace(/\s{2,}/g, ' ').trim();
      }
    }

    if (!result.micr && /micr/i.test(lines[i])) {
      const match = lines[i].match(/micr\s*(?:code)?\s*[:\-]?\s*(\d{9})/i);
      if (match) {
        result.micr = match[1];
      }
    }

    if (!result.statementPeriod && /period/i.test(lines[i])) {
      const match = lines[i].match(/period\s*[:\-]?\s*([\d\/\-.]+)\s*(?:to|-|–|upto)\s*([\d\/\-.]+)/i);
      if (match) {
        result.statementPeriod = `${match[1].trim()} to ${match[2].trim()}`;
      }
    }

    if (!result.pincode) {
      const pinMatch = lines[i].match(/\b(\d{6})\b/);
      if (pinMatch && /pin|pincode|postal/i.test(lines[i])) {
        result.pincode = pinMatch[1];
      }
    }

    if (!result.bankName) {
      if (/(bank|finance|credit)/i.test(lines[i])) {
        result.bankName = lines[i].replace(/statement|account|period|from|to|page|date/gi, '').trim();
        // Clean up common bank name artifacts
        result.bankName = result.bankName.replace(/^\W+|\W+$/g, '');
      }
    }
  }

  // Extract balances
  const balances = findBalances(lines);
  if (balances.starting) result.startingBalance = balances.starting;
  if (balances.ending) result.endingBalance = balances.ending;

  // Extract transactions
  const transactions: Transaction[] = [];
  let transactionStarted = false;

  for (const line of lines) {
    // Look for transaction table headers
    if (!transactionStarted &&
        /date.*description.*debit.*credit.*balance/i.test(line.toLowerCase())) {
      transactionStarted = true;
      continue;
    }

    if (transactionStarted) {
      const transaction = extractTransactionRow(line);
      if (transaction && transaction.date) {
        transactions.push({
          id: `T${transactions.length + 1}`,
          date: transaction.date,
          description: transaction.description || 'Transaction',
          reference: transaction.reference || '',
          debit: transaction.debit || 0,
          credit: transaction.credit || 0,
          balance: transaction.balance || 0,
        } as Transaction);
      }
    }
  }

  if (transactions.length > 0) {
    result.transactions = transactions;

    // If balances weren't found in headers/footers, use transaction data
    if (!result.startingBalance) {
      result.startingBalance = transactions[0].balance;
    }
    if (!result.endingBalance) {
      result.endingBalance = transactions[transactions.length - 1].balance;
    }
  }
};

interface OcrResult {
  name?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  startingBalance?: number;
  endingBalance?: number;
  branchName?: string;
  branchAddress?: string;
  branchPhone?: string;
  email?: string;
  micr?: string;
  statementPeriod?: string;
  city?: string;
  state?: string;
  pincode?: string;
  transactions?: Transaction[];
  rawText: string;
}

const extractAmount = (text: string): number | null => {
  const match = text.match(/(?:Rs\.?|INR)?\s*([0-9,]+\.?\d*)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/,/g, ''));
};

const extractDate = (text: string): string | null => {
  // Match common Indian date formats (DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY)
  const match = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (!match) return null;
  
  let [, day, month, year] = match;
  if (year.length === 2) year = '20' + year;
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  ).toISOString();
};

const extractTransactionRow = (line: string): Partial<Transaction> | null => {
  // Remove multiple spaces and split by whitespace or tabs
  const parts = line.replace(/\s+/g, ' ').split(/\s+/);
  if (parts.length < 4) return null;

  const date = extractDate(parts[0]);
  if (!date) return null;

  let description = '';
  let debit = 0;
  let credit = 0;
  let balance = 0;
  let reference = '';

  // Look for amounts in reverse order (usually Balance, Credit/Debit)
  for (let i = parts.length - 1; i >= 0; i--) {
    const amount = extractAmount(parts[i]);
    if (amount !== null) {
      if (balance === 0) {
        balance = amount;
      } else if (parts[i-1]?.toLowerCase().includes('cr') || credit === 0) {
        credit = amount;
      } else {
        debit = amount;
      }
    } else if (parts[i].match(/[A-Z0-9]{6,}/)) {
      reference = parts[i];
    } else if (!description && i > 0 && i < parts.length - 2) {
      description = parts.slice(1, i + 1).join(' ');
    }
  }

  if (!description || (!debit && !credit) || !balance) return null;

  return {
    date,
    description,
    debit,
    credit,
    balance,
    reference: reference || undefined
  };
};

const findBalances = (lines: string[]): { starting?: number; ending?: number } => {
  const result: { starting?: number; ending?: number } = {};
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('opening') || lower.includes('brought forward')) {
      const amount = extractAmount(line);
      if (amount !== null) result.starting = amount;
    }
    if (lower.includes('closing') || lower.includes('carried forward')) {
      const amount = extractAmount(line);
      if (amount !== null) result.ending = amount;
    }
  }
  
  return result;
};

export const runOcrOnDocument = async (uri: string): Promise<OcrResult> => {
  try {
    console.log('Starting OCR processing for URI:', uri);

    // Get file info to determine type
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Check if it's a PDF or image
    const isPdf = uri.toLowerCase().endsWith('.pdf') ||
                  fileInfo.uri.toLowerCase().includes('.pdf');

    let text: string;
    let allLines: string[];

    if (isPdf) {
      console.log('Processing PDF file...');
      
      // Process PDF with PDF.js
      const pdfResult = await processPdfFile(uri);
      text = pdfResult.text;
      allLines = text.split('\n');
      
      console.log(`PDF processed: ${pdfResult.pages.length} pages, ${text.length} characters`);
      
    } else {
      console.log('Processing image file...');
      
      // For images, convert to base64 and process with Tesseract
      console.log('Converting image to base64...');
      const base64 = await getFileAsBase64(uri);

      // Validate base64 data
      if (!base64 || base64.length < 100) {
        throw new Error('The selected file appears to be empty or corrupted. Please select a valid image file.');
      }

      // Check file size (base64 is ~33% larger than binary)
      const estimatedFileSize = (base64.length * 3) / 4;
      if (estimatedFileSize > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('The selected image is too large. Please use an image smaller than 10MB.');
      }

      console.log(`Image size: ~${Math.round(estimatedFileSize / 1024)}KB`);

      // Determine MIME type based on file extension
      let mimeType = 'image/jpeg'; // default
      if (uri.toLowerCase().includes('.png')) {
        mimeType = 'image/png';
      } else if (uri.toLowerCase().includes('.jpg') || uri.toLowerCase().includes('.jpeg')) {
        mimeType = 'image/jpeg';
      }

      const imageDataUrl = createImageDataUrl(base64, mimeType);
      text = await processImageWithOCR(imageDataUrl, base64, mimeType);
      allLines = text.split('\n');
    }

    if (!text.trim()) {
      throw new Error('No text could be extracted from the file. Please ensure the file contains clear, readable text and try again.');
    }

    // Validate that we have some meaningful content
    const wordCount = text.split(/\s+/).filter((word: string) => word.length > 2).length;
    if (wordCount < 5) {
      throw new Error('Very little text was extracted. Please use a higher quality file with clearer text.');
    }

    const lines = allLines.map((line: string) => line.trim()).filter(Boolean);
    const headerLines = lines.slice(0, 60);
    const result: OcrResult = { rawText: text };

    // Detect bank type and use specific parser
    const bankType = detectBankType(text);
    console.log('Detected bank type:', bankType);

    // Use bank-specific parser for better accuracy
    const parsedData = parseBankStatement(text);
    
    // Merge parsed data with result
    if (parsedData.name) result.name = parsedData.name;
    if (parsedData.accountNumber) result.accountNumber = parsedData.accountNumber;
    if (parsedData.ifsc) result.ifsc = parsedData.ifsc;
    if (parsedData.bankName) result.bankName = parsedData.bankName;
    if (parsedData.branchName) result.branchName = parsedData.branchName;
    if (parsedData.branchAddress) result.branchAddress = parsedData.branchAddress;
    if (parsedData.city) result.city = parsedData.city;
    if (parsedData.state) result.state = parsedData.state;
    if (parsedData.pincode) result.pincode = parsedData.pincode;
    if (parsedData.phoneNumber) result.branchPhone = parsedData.phoneNumber;
    if (parsedData.email) result.email = parsedData.email;
    if (parsedData.micr) result.micr = parsedData.micr;
    if (parsedData.startingBalance) result.startingBalance = parsedData.startingBalance;
    if (parsedData.endingBalance) result.endingBalance = parsedData.endingBalance;
    if (parsedData.statementPeriod) result.statementPeriod = parsedData.statementPeriod;

    // Fallback to generic extraction if bank-specific parser didn't get everything
    extractDataFromText(lines, result, headerLines);

    console.log('OCR processing completed successfully');
    console.log('Extracted data:', {
      bankType,
      name: result.name,
      accountNumber: result.accountNumber,
      ifsc: result.ifsc,
      branchName: result.branchName,
      city: result.city,
      state: result.state,
    });
    
    return result;

  } catch (error) {
    console.error('OCR processing failed:', error);
    throw error;
  }
};
