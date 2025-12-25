import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Statement } from '@/types/statement';

export interface GenerationConfig {
  userType: 'salaried' | 'selfEmployed' | null;
  bankTemplate: 'PNB' | 'SBI' | 'HDFC' | 'ICICI' | 'AXIS' | 'KOTAK' | 'IDFC' | 'INDUSIND' | 'CBI' | 'YES' | 'BOB' | 'UCO' | 'IOB' | 'CANARA' | 'UNION';
  lastUsedAt?: string;
}

export interface OcrFormData {
  name?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  address?: string;
  city?: string;
  state?: string;
  bankBranch?: string;
  branchAddress?: string;
  phoneNumber?: string;
  email?: string;
  startingBalance?: number;
  closingBalance?: number;
  template?: 'PNB' | 'SBI' | 'HDFC' | 'ICICI' | 'AXIS' | 'KOTAK' | 'IDFC' | 'INDUSIND' | 'CBI' | 'YES' | 'BOB' | 'UCO' | 'IOB' | 'CANARA' | 'UNION';
}

interface AppState {
  config: GenerationConfig;
  savedStatements: Statement[];
  darkModeOverride: 'light' | 'dark' | null;
  ocrFormData: OcrFormData | null;
  setConfig: (config: Partial<GenerationConfig>) => void;
  addStatement: (statement: Statement) => void;
  removeStatement: (id: string) => void;
  setDarkModeOverride: (mode: 'light' | 'dark' | null) => void;
  updateStatement: (id: string, updates: Partial<Statement>) => void;
  setOcrFormData: (data: OcrFormData | null) => void;
  reset: () => void;
}

const storage = createJSONStorage(() => AsyncStorage);

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      config: {
        userType: null,
        bankTemplate: 'HDFC'
      },
      savedStatements: [],
      darkModeOverride: null,
      ocrFormData: null,
      setConfig: (config) =>
        set((state) => {
          state.config = {
            ...state.config,
            ...config,
            lastUsedAt: new Date().toISOString()
          };
        }),
      addStatement: (statement) =>
        set((state) => {
          state.savedStatements.unshift(statement);
          state.config.lastUsedAt = new Date().toISOString();
        }),
      updateStatement: (id, updates) =>
        set((state) => {
          state.savedStatements = state.savedStatements.map((stmt) =>
            stmt.id === id ? { ...stmt, ...updates } : stmt
          );
        }),
      removeStatement: (id) =>
        set((state) => {
          state.savedStatements = state.savedStatements.filter((stmt) => stmt.id !== id);
        }),
      setDarkModeOverride: (mode) =>
        set((state) => {
          state.darkModeOverride = mode;
        }),
      setOcrFormData: (data) =>
        set((state) => {
          state.ocrFormData = data;
        }),
      reset: () =>
        set((state) => {
          state.config = { userType: null, bankTemplate: 'HDFC' };
          state.savedStatements = [];
          state.darkModeOverride = null;
          state.ocrFormData = null;
        })
    })),
    {
      name: 'bankstatement-app-store',
      storage,
      version: 1
    }
  )
);
