import { buildSalariedStatement } from './salaried-generator';
import { buildSelfEmployedStatement } from './self-employed-generator';
import { SalariedFormValues, SelfEmployedFormValues } from './types';
import { Statement } from '@/types/statement';
export const generateStatement = (
  values: SalariedFormValues | SelfEmployedFormValues,
  options: { seed: number },
) => {
  if ('employer' in values) {
    const s = buildSalariedStatement(values, options);
    // console.log(JSON.stringify(s, null, 2));
    return s;
  }
  const s = buildSelfEmployedStatement(values, options);
  // console.log(s);
  return s;
};
