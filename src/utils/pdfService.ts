import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function getPdfServiceUrl(): string {
  const extra = Constants.expoConfig?.extra;

  console.log('EXTRA CONFIG:', Constants.expoConfig?.extra);

  if (Platform.OS === 'web') {
    return extra?.PDF_SERVICE_URL_WEB;
  }

//   if (Platform.OS === 'android') {
//     return extra?.PDF_SERVICE_URL_ANDROID;
//   }

  return extra?.PDF_SERVICE_URL_DEVICE;
}