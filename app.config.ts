import 'dotenv/config';

export default {
  expo: {
    name: 'AppStatement',
    slug: 'appstatement',

    extra: {
      PDF_SERVICE_URL_WEB: process.env.EXPO_PUBLIC_PDF_SERVICE_URL_WEB,
      PDF_SERVICE_URL_ANDROID: process.env.EXPO_PUBLIC_PDF_SERVICE_URL_ANDROID,
      PDF_SERVICE_URL_DEVICE: process.env.EXPO_PUBLIC_PDF_SERVICE_URL_DEVICE,
    },
  },
};