import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Statement } from '@/types/statement';
import { getPdfServiceUrl } from '@/utils/pdfService';

export const exportStatementToPdf = async (statement: Statement) => {
  const url = getPdfServiceUrl();

  if (!url) {
    throw new Error('PDF service URL not configured');
  }

  console.log("HERE")

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    },
    body: JSON.stringify(statement),
  });

  if (!response.ok) {
    throw new Error(`PDF service failed: ${response.status}`);
  }

  //  WEB (browser)
  if (Platform.OS === 'web') {
    const blob = await response.blob();
    const fileUrl = URL.createObjectURL(blob);
    window.open(fileUrl, '_blank');
    return fileUrl;
  }

  //  NATIVE (Android / iOS)
  const buffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);

  const fileUri =
    FileSystem.cacheDirectory + `statement-${Date.now()}.pdf`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share statement',
    });
  }

  return fileUri;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}