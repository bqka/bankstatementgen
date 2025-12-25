import { useCallback, useMemo, useState } from 'react';
import { generateStatement } from '../utils';
import { SalariedFormValues, SelfEmployedFormValues } from '../utils/types';
import { useAppStore } from '@/store/app-store';
import { Statement } from '@/types/statement';
interface Result { 
  generate: (values: SalariedFormValues | SelfEmployedFormValues, seed?: number,
  ) => Statement;
  regenerate: () => Statement | null;
  lastStatement: Statement | null;
  isGenerating: boolean;
}

export const useGenerateStatement = (): Result => {
  const addStatement = useAppStore((state) => state.addStatement);
  const [lastStatement, setLastStatement] = useState<Statement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastInput, setLastInput] = useState<
    (SalariedFormValues | SelfEmployedFormValues) | null
  >(null);
  const initialSeed = useMemo(() => Math.floor(Math.random() * 1_000_000), []);

  const generate = useCallback(
    (values: SalariedFormValues | SelfEmployedFormValues, seed?: number) => {
      setIsGenerating(true);
      try {
        const nextSeed = seed ?? Math.floor(Math.random() * 1_000_000) + initialSeed;
        const statement = generateStatement(values, { seed: nextSeed });
        addStatement(statement);
        setLastStatement(statement);
        setLastInput(values);
        return statement;
      } finally {
        setIsGenerating(false);
      }
    },
    [addStatement, initialSeed],
  );

  const regenerate = useCallback(() => {
    if (!lastInput) {
      return null;
    }
    const nextSeed = Math.floor(Math.random() * 1_000_000) + initialSeed;
    const statement = generateStatement(lastInput, { seed: nextSeed });
    addStatement(statement);
    setLastStatement(statement);
    setLastInput(lastInput);
    return statement;
  }, [addStatement, initialSeed, lastInput]);

  return { generate, regenerate, lastStatement, isGenerating };
};
