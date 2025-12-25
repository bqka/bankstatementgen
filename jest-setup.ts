import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn()
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn()
}));

jest.mock('expo-print', () => ({
  printAsync: jest.fn(),
  selectPrinterAsync: jest.fn()
}));

jest.mock('expo-router', () => require('expo-router/testing-library')); // Use router testing helpers
