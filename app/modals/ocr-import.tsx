import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/providers/theme-provider';
import { runOcrOnDocument } from '@/services/ocr/reader';
import { useGenerateStatement } from '@/features/generate/hooks/use-generate-statement';
import { Statement, Transaction } from '@/types/statement';
import { SalariedFormValues } from '@/features/generate/utils/types';
import { useAppStore } from '@/store/app-store';

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

const OcrImportModal = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const { generate } = useGenerateStatement();
  const { setOcrFormData } = useAppStore();
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [autoStatement, setAutoStatement] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');

  const handleAutoFillForm = () => {
    if (!ocrResult) return;

    // Detect bank template from bank name
    let template: any = 'HDFC';
    if (ocrResult.bankName) {
      const bankUpper = ocrResult.bankName.toUpperCase();
      if (bankUpper.includes('SBI') || bankUpper.includes('STATE BANK')) template = 'SBI';
      else if (bankUpper.includes('HDFC')) template = 'HDFC';
      else if (bankUpper.includes('ICICI')) template = 'ICICI';
      else if (bankUpper.includes('AXIS')) template = 'AXIS';
      else if (bankUpper.includes('KOTAK')) template = 'KOTAK';
      else if (bankUpper.includes('IDFC')) template = 'IDFC';
      else if (bankUpper.includes('INDUSIND')) template = 'INDUSIND';
      else if (bankUpper.includes('PNB') || bankUpper.includes('PUNJAB NATIONAL')) template = 'PNB';
      else if (bankUpper.includes('YES')) template = 'YES';
      else if (bankUpper.includes('BOB') || bankUpper.includes('BARODA')) template = 'BOB';
      else if (bankUpper.includes('UCO')) template = 'UCO';
      else if (bankUpper.includes('IOB') || bankUpper.includes('INDIAN OVERSEAS')) template = 'IOB';
      else if (bankUpper.includes('CANARA')) template = 'CANARA';
      else if (bankUpper.includes('UNION')) template = 'UNION';
      else if (bankUpper.includes('CBI') || bankUpper.includes('CENTRAL BANK')) template = 'CBI';
    }

    // Prepare form data from OCR result
    const formData = {
      name: ocrResult.name,
      accountNumber: ocrResult.accountNumber,
      ifsc: ocrResult.ifsc,
      bankName: ocrResult.bankName || template + ' Bank',
      address: ocrResult.branchAddress,
      city: ocrResult.city,
      state: ocrResult.state,
      bankBranch: ocrResult.branchName,
      branchAddress: ocrResult.branchAddress,
      phoneNumber: ocrResult.branchPhone,
      email: ocrResult.email,
      startingBalance: ocrResult.startingBalance,
      closingBalance: ocrResult.endingBalance,
      template,
    };

    // Save to store and navigate back
    setOcrFormData(formData);
    Alert.alert(
      'Form Auto-Filled! ✓',
      'The form has been filled with extracted data. Please review and adjust values before generating the statement.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handlePick = async () => {
    setLoading(true);
    setProgressMessage('Selecting document...');
    setOcrResult(null);
    setAutoStatement(null);
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled || !result.assets?.length) {
        setLoading(false);
        setProgressMessage('');
        return;
      }
      
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name || 'unknown';
      const fileSize = result.assets[0].size || 0;
      
      console.log('Selected file:', { fileName, fileSize, uri: fileUri });
      
      // Validate file size (max 10MB)
      if (fileSize > 10 * 1024 * 1024) {
        Alert.alert(
          'File Too Large',
          'Please select a file smaller than 10MB. Large files may fail to process.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        setProgressMessage('');
        return;
      }
      
      setProgressMessage('Processing document... This may take 30-60 seconds');
      
      const data = await runOcrOnDocument(fileUri);
      setOcrResult(data);
      setProgressMessage('');

      console.log('OCR Result:', {
        name: data.name,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        bankName: data.bankName,
        startingBalance: data.startingBalance,
        endingBalance: data.endingBalance,
        transactionsCount: data.transactions?.length,
        rawTextLength: data.rawText.length
      });

      // Check if we have minimum required data
      const hasBasicInfo = data.name || data.accountNumber || data.ifsc || data.bankName;
      const hasTransactions = data.transactions && data.transactions.length > 0;

      if (!hasBasicInfo && !hasTransactions) {
        Alert.alert(
          'Limited Data Extracted',
          'We could extract some text but couldn\'t identify specific account details. This may be due to:\n\n• Poor image quality or resolution\n• Unsupported statement format\n• Handwritten or scanned text\n\nTry:\n• Using a clearer, higher resolution image\n• Converting PDF to image format\n• Taking a well-lit photo of the statement',
          [
            { text: 'Try Another File', style: 'default' },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        setLoading(false);
        setProgressMessage('');
        return;
      }

      setProgressMessage('Generating statement...');

      // Build statement details from OCR data
      const details = {
        name: data.name || 'Account Holder',
        accountNumber: data.accountNumber || '0000000000',
        ifsc: data.ifsc || 'XXXX0000000',
        bankName: data.bankName || 'Bank',
        startingBalance: data.startingBalance || data.transactions?.[0]?.balance || 10000,
        branch: data.branchName,
        address: data.branchAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      };

      let statement: Statement;

      // If OCR extracted transactions, use them
      if (data.transactions && data.transactions.length > 0) {
        statement = {
          id: `ocr-${Date.now()}`,
          details,
          transactions: data.transactions,
          meta: {
            generatedAt: new Date().toISOString(),
            template: data.bankName?.toUpperCase() as any || 'HDFC',
            userType: 'salaried',
            configHash: '',
            seed: Math.floor(Math.random() * 1_000_000),
          },
        };
      } else {
        // Fallback: use random generator
        const fallback: SalariedFormValues = {
          name: details.name,
          accountNumber: details.accountNumber,
          ifsc: details.ifsc,
          bankName: details.bankName,
          startingBalance: details.startingBalance,
          branch: data.branchName,
          address: data.branchAddress,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          employer: 'Auto-OCR',
          customEmployer: '',
          salaryAmount: 35000,
          durationMonths: 3,
          template: data.bankName?.toUpperCase() as any || 'HDFC',
          numberOfTransactions: 100,
          closingBalance: data.endingBalance,
        };
        statement = generate(fallback);
      }

      setAutoStatement(statement);
      setLoading(false);
      setProgressMessage('');
    } catch (error) {
      setLoading(false);
      setProgressMessage('');
      console.error('OCR Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unable to process the document. Please try again.';
      Alert.alert(
        'OCR Processing Failed', 
        errorMessage + '\n\nTips:\n• Ensure image is clear and well-lit\n• Try converting PDF to JPG/PNG\n• Use higher resolution images\n• Check file is not corrupted',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <Screen scroll>
      <ScrollView>
        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: theme.typography.headline.fontSize, fontWeight: '700', color: theme.palette.text }}>
                Auto-fill from bank statement
              </Text>
              <Text style={{ color: theme.palette.textMuted, marginTop: 4 }}>
                Upload your bank statement (PDF, PNG, JPG). We will extract account details, branch information, and transactions automatically - all offline.
              </Text>
            </View>
            <Button
              variant="ghost"
              size="small"
              onPress={() => router.back()}
              style={{ marginLeft: theme.spacing.md }}
            >
              <Ionicons name="close" size={20} color={theme.palette.textMuted} />
            </Button>
          </View>
          <Button onPress={handlePick} isLoading={loading} disabled={loading}>
            {loading 
              ? (progressMessage || 'Processing Document... Please wait') 
              : 'Select Statement (PDF/Image)'
            }
          </Button>
          
          {/* Info boxes */}
          <View style={{ backgroundColor: theme.palette.surfaceMuted, padding: theme.spacing.md, borderRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons name="information-circle-outline" size={20} color={theme.palette.primary} style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.palette.text, fontWeight: '600', marginBottom: 4 }}>
                  Supported Formats
                </Text>
                <Text style={{ color: theme.palette.textMuted, fontSize: 13, lineHeight: 18 }}>
                  PDF files (direct text extraction) and Images (PNG, JPG, JPEG with OCR). All processing happens offline on your device.
                </Text>
              </View>
            </View>
          </View>
          
          <View style={{ backgroundColor: theme.palette.surfaceMuted, padding: theme.spacing.md, borderRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.palette.success} style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.palette.text, fontWeight: '600', marginBottom: 4 }}>
                  Best Results
                </Text>
                <Text style={{ color: theme.palette.textMuted, fontSize: 13, lineHeight: 18 }}>
                  Use clear, high-resolution images. Ensure text is readable and not blurry. Supported banks: HDFC, ICICI, SBI, Axis, Kotak, PNB, and more.
                </Text>
              </View>
            </View>
          </View>
          {ocrResult && (
            <View style={{ marginTop: theme.spacing.lg }}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Extracted Details:</Text>
              <View style={{ backgroundColor: theme.palette.surface, padding: theme.spacing.md, borderRadius: 8, gap: 4 }}>
                <Text style={{ color: theme.palette.text }}>Name: <Text style={{ fontWeight: '600' }}>{ocrResult.name || 'Not detected'}</Text></Text>
                <Text style={{ color: theme.palette.text }}>Account Number: <Text style={{ fontWeight: '600' }}>{ocrResult.accountNumber || 'Not detected'}</Text></Text>
                <Text style={{ color: theme.palette.text }}>IFSC: <Text style={{ fontWeight: '600' }}>{ocrResult.ifsc || 'Not detected'}</Text></Text>
                <Text style={{ color: theme.palette.text }}>Bank: <Text style={{ fontWeight: '600' }}>{ocrResult.bankName || 'Not detected'}</Text></Text>
                <Text style={{ color: theme.palette.text }}>Branch: <Text style={{ fontWeight: '600' }}>{ocrResult.branchName || 'Not detected'}</Text></Text>
                {ocrResult.branchAddress && (
                  <Text style={{ color: theme.palette.text }}>Branch Address: <Text style={{ fontWeight: '600' }}>{ocrResult.branchAddress}</Text></Text>
                )}
                {ocrResult.email && (
                  <Text style={{ color: theme.palette.text }}>Email: <Text style={{ fontWeight: '600' }}>{ocrResult.email}</Text></Text>
                )}
                {ocrResult.branchPhone && (
                  <Text style={{ color: theme.palette.text }}>Branch Phone: <Text style={{ fontWeight: '600' }}>{ocrResult.branchPhone}</Text></Text>
                )}
                {ocrResult.micr && (
                  <Text style={{ color: theme.palette.text }}>MICR: <Text style={{ fontWeight: '600' }}>{ocrResult.micr}</Text></Text>
                )}
                {(ocrResult.city || ocrResult.state || ocrResult.pincode) && (
                  <Text style={{ color: theme.palette.text }}>
                    Location: <Text style={{ fontWeight: '600' }}>{[ocrResult.city, ocrResult.state, ocrResult.pincode].filter(Boolean).join(', ')}</Text>
                  </Text>
                )}
                {ocrResult.statementPeriod && (
                  <Text style={{ color: theme.palette.text }}>Statement Period: <Text style={{ fontWeight: '600' }}>{ocrResult.statementPeriod}</Text></Text>
                )}
                {ocrResult.startingBalance && (
                  <Text style={{ color: theme.palette.text }}>Opening Balance: <Text style={{ fontWeight: '600' }}>₹{ocrResult.startingBalance.toLocaleString()}</Text></Text>
                )}
                {ocrResult.endingBalance && (
                  <Text style={{ color: theme.palette.text }}>Closing Balance: <Text style={{ fontWeight: '600' }}>₹{ocrResult.endingBalance.toLocaleString()}</Text></Text>
                )}
              </View>
              <Button
                variant="primary"
                size="medium"
                onPress={handleAutoFillForm}
                style={{ marginTop: theme.spacing.md }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                Auto-Fill Form with Extracted Data
              </Button>
              <Text style={{ fontSize: 12, color: theme.palette.textMuted, marginTop: 8, textAlign: 'center' }}>
                Raw text extracted: {ocrResult.rawText.length} characters
              </Text>
            </View>
          )}
          {ocrResult?.transactions && ocrResult.transactions.length > 0 && (
            <View style={{ marginTop: theme.spacing.lg }}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Extracted Transactions ({ocrResult.transactions.length}):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {ocrResult.transactions.slice(0, 15).map((txn, idx) => (
                    <View key={txn.id || idx} style={{ flexDirection: 'row', paddingVertical: 2 }}>
                      <Text style={{ fontSize: 11, minWidth: 80 }}>
                        {new Date(txn.date).toLocaleDateString()}
                      </Text>
                      <Text style={{ fontSize: 11, minWidth: 120, marginLeft: 8 }} numberOfLines={1}>
                        {txn.description}
                      </Text>
                      <Text style={{ fontSize: 11, minWidth: 60, marginLeft: 8, color: txn.debit > 0 ? theme.palette.error : theme.palette.success }}>
                        {txn.debit > 0 ? `-₹${txn.debit.toLocaleString()}` : txn.credit > 0 ? `+₹${txn.credit.toLocaleString()}` : ''}
                      </Text>
                      <Text style={{ fontSize: 11, minWidth: 80, marginLeft: 8 }}>
                        ₹{txn.balance.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                  {ocrResult.transactions.length > 15 && (
                    <Text style={{ fontSize: 11, fontStyle: 'italic', marginTop: 4 }}>
                      ...and {ocrResult.transactions.length - 15} more transactions
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
          )}
          {ocrResult && (!ocrResult.transactions || ocrResult.transactions.length === 0) && (
            <View style={{ marginTop: theme.spacing.lg, padding: theme.spacing.md, backgroundColor: theme.palette.accentMuted, borderRadius: 8 }}>
              <Text style={{ fontWeight: '600', color: theme.palette.warning, marginBottom: 4 }}>No Transactions Found</Text>
              <Text style={{ fontSize: 12, color: theme.palette.textMuted }}>
                Account details were extracted, but no transaction data was found. A random statement will be generated using the extracted account information.
              </Text>
            </View>
          )}
          {autoStatement && (
            <View style={{ marginTop: theme.spacing.lg, padding: theme.spacing.md, backgroundColor: theme.palette.surfaceMuted, borderRadius: 8 }}>
              <Text style={{ fontWeight: '700', marginBottom: 8, color: theme.palette.success }}>✓ Statement Generated Successfully</Text>
              <Text>Account Holder: {autoStatement.details.name || 'Not specified'}</Text>
              <Text>Account Number: {autoStatement.details.accountNumber || 'Not specified'}</Text>
              <Text>Bank: {autoStatement.details.bankName || 'Not specified'}</Text>
              {autoStatement.details.branch && (
                <Text>Branch: {autoStatement.details.branch}</Text>
              )}
              {(autoStatement.details.address || autoStatement.details.city || autoStatement.details.pincode) && (
                <Text>
                  Location: {[autoStatement.details.address, autoStatement.details.city, autoStatement.details.state, autoStatement.details.pincode].filter(Boolean).join(', ')}
                </Text>
              )}
              {ocrResult?.branchPhone && (
                <Text>Branch Phone: {ocrResult.branchPhone}</Text>
              )}
              {ocrResult?.micr && (
                <Text>MICR: {ocrResult.micr}</Text>
              )}
              {ocrResult?.statementPeriod && (
                <Text>Statement Period: {ocrResult.statementPeriod}</Text>
              )}
              <Text>Transactions: {autoStatement.transactions.length}</Text>
              <Text>Starting Balance: ₹{autoStatement.details.startingBalance.toLocaleString()}</Text>
              <Text>Ending Balance: ₹{autoStatement.transactions[autoStatement.transactions.length - 1]?.balance.toLocaleString()}</Text>
              <Text>Template: {autoStatement.meta.template}</Text>
              <Text style={{ fontSize: 12, color: theme.palette.textMuted, marginTop: 4 }}>
                Generated on {new Date(autoStatement.meta.generatedAt).toLocaleString()}
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                <Button
                  variant="primary"
                  size="medium"
                  onPress={() => router.back()}
                  style={{ flex: 1 }}
                >
                  Use This Statement
                </Button>
                <Button
                  variant="outline"
                  size="medium"
                  onPress={() => setAutoStatement(null)}
                >
                  Try Another Document
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default OcrImportModal;
