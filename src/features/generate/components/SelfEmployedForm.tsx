import React, { useState } from 'react';
import { View, Platform, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextField } from '@/components/ui/TextField';
import { Dropdown, DropdownOption } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { bankTemplates } from '@/constants/bank-templates';
import { SelfEmployedFormValues } from '../utils/types';
import { useAppTheme } from '@/providers/theme-provider';

const schema = z
  .object({
    name: z.string().min(3),
    accountNumber: z.string().min(6).max(18),
    ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Invalid IFSC'),
    bankName: z.string().min(3),
    address: z.string().min(10, 'Enter complete address (minimum 10 characters)').optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    bankBranch: z.string().optional().or(z.literal('')),
    branchAddress: z.string().optional().or(z.literal('')),
    phoneNumber: z.string().optional().or(z.literal('')),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    turnover: z
      .number({ invalid_type_error: 'Turnover must be numeric' })
      .min(500000, 'Minimum ₹5,00,000')
      .max(2500000, 'Maximum ₹25,00,000'),
    periodMonths: z.enum(['3', '6']).transform((val) => parseInt(val, 10) as 3 | 6),
    template: z.enum(['PNB', 'SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK', 'IDFC', 'INDUSIND', 'CBI', 'YES', 'BOB', 'UCO', 'IOB', 'CANARA', 'UNION']),
    startingBalance: z
      .number({ invalid_type_error: 'Starting balance must be numeric' })
      .min(15000),
    numberOfTransactions: z
      .number({ invalid_type_error: 'Number of transactions must be numeric' })
      .min(0),
    closingBalance: z
      .number({ invalid_type_error: 'Closing balance must be numeric' })
      .min(0)
      .optional(),
    statementStartDate: z.date().optional(),
    statementEndDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate transaction count based on period
    const period = typeof data.periodMonths === 'number' ? data.periodMonths : parseInt(data.periodMonths, 10);
    const maxTransactions = period === 3 ? 1000 : 5000;
    if (data.numberOfTransactions > maxTransactions) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: `Maximum ${maxTransactions} transactions for ${period} months`, 
        path: ['numberOfTransactions'] 
      });
    }
    // Validate closing balance if provided
    if (data.closingBalance !== undefined && data.closingBalance < 1000) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: 'Minimum closing balance is ₹1,000', 
        path: ['closingBalance'] 
      });
    }
    // Validate date range
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (data.statementEndDate && data.statementEndDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date cannot be in the future',
        path: ['statementEndDate']
      });
    }
    
    if (data.statementStartDate && data.statementStartDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date cannot be in the future',
        path: ['statementStartDate']
      });
    }
    
    if (data.statementStartDate && data.statementEndDate && data.statementEndDate <= data.statementStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['statementEndDate']
      });
    }
  });

type FormData = Omit<z.infer<typeof schema>, 'periodMonths'> & { periodMonths: '3' | '6' };

interface Props {
  onSubmit: (values: SelfEmployedFormValues) => void;
  isLoading?: boolean;
}

export const SelfEmployedForm = ({ onSubmit, isLoading }: Props) => {
  const theme = useAppTheme();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      address: '',
      city: '',
      state: '',
      bankBranch: '',
      branchAddress: '',
      phoneNumber: '',
      email: '',
      turnover: 1200000,
      periodMonths: '6',
      template: 'ICICI',
      startingBalance: 45000,
      numberOfTransactions: 150,
      closingBalance: undefined,
      statementStartDate: undefined,
      statementEndDate: undefined
    }
  });

  const periodValue = watch('periodMonths');

  const templateOptions: DropdownOption<FormData['template']>[] = bankTemplates.map((template) => ({
    label: `${template} Bank Template`,
    value: template
  }));

  const submit = handleSubmit((values) => {
    const payload: SelfEmployedFormValues = {
      name: values.name,
      accountNumber: values.accountNumber,
      ifsc: values.ifsc,
      bankName: values.bankName,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      bankBranch: values.bankBranch || undefined,
      branchAddress: values.branchAddress || undefined,
      phoneNumber: values.phoneNumber || undefined,
      email: values.email || undefined,
      startingBalance: values.startingBalance,
      template: values.template,
      turnover: values.turnover,
      periodMonths: parseInt(values.periodMonths, 10) as 3 | 6,
      numberOfTransactions: values.numberOfTransactions,
      closingBalance: values.closingBalance
    };
    onSubmit(payload);
  });

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange } }) => (
          <TextField label="Business owner name" value={value} onChangeText={onChange} error={errors.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="accountNumber"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="Account number"
            keyboardType="number-pad"
            value={value}
            onChangeText={onChange}
            error={errors.accountNumber?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="ifsc"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="IFSC code"
            autoCapitalize="characters"
            value={value}
            onChangeText={(val) => onChange(val.toUpperCase())}
            error={errors.ifsc?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="bankName"
        render={({ field: { value, onChange } }) => (
          <TextField label="Bank name" value={value} onChangeText={onChange} error={errors.bankName?.message} />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="Address (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.address?.message}
            multiline
            numberOfLines={3}
            helperText="Your residential/business address (will appear on statement)"
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="City (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.city?.message}
            helperText="City name (e.g., BHOPAL)"
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="State (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.state?.message}
            helperText="State name (e.g., MADHYA PRADESH)"
          />
        )}
      />
      <Controller
        control={control}
        name="bankBranch"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="Bank Branch (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.bankBranch?.message}
            helperText="Branch name (e.g., CHUNA BHATTI)"
          />
        )}
      />
      <Controller
        control={control}
        name="branchAddress"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="Branch Address (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.branchAddress?.message}
            helperText="Branch address (e.g., VILL CHOPRA KALAN, PO)"
          />
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="Phone Number (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.phoneNumber?.message}
            keyboardType="numeric"
            helperText="Contact number (e.g., 18002026161)"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <TextField 
            label="Email (Optional)" 
            value={value} 
            onChangeText={onChange} 
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            helperText="Email address for statement"
          />
        )}
      />
      <Controller
        control={control}
        name="template"
        render={({ field: { value, onChange } }) => (
          <Dropdown
            label="Bank template"
            options={templateOptions}
            value={value}
            onChange={onChange}
            error={errors.template?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="turnover"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="Total turnover (₹)"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={(text) => onChange(Number(text.replace(/[^0-9]/g, '')) || 0)}
            helperText="Distributed across 7-12 deposits"
            error={errors.turnover?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="periodMonths"
        render={({ field: { value, onChange } }) => (
          <Dropdown
            label="Statement period"
            options={[
              { label: 'Last 3 months', value: '3' },
              { label: 'Last 6 months', value: '6' }
            ]}
            value={value}
            onChange={onChange}
            error={errors.periodMonths?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="statementStartDate"
        render={({ field: { value, onChange } }) => (
          <View>
            <Button
              onPress={() => setShowStartDatePicker(true)}
              variant="secondary"
            >
              {value ? `Start Date: ${value.toLocaleDateString('en-IN')}` : 'Set Start Date (Optional)'}
            </Button>
            <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
              <Text style={{ color: theme.palette.textSecondary, fontSize: 11 }}>
                Statement will start from this date. Leave empty to auto-calculate.
              </Text>
            </View>
            {errors.statementStartDate?.message && (
              <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
                <Text style={{ color: theme.palette.error, fontSize: 12 }}>
                  {errors.statementStartDate.message}
                </Text>
              </View>
            )}
            {showStartDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    // Normalize to local date at noon to avoid timezone issues
                    const normalized = new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      12, 0, 0, 0
                    );
                    onChange(normalized);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="statementEndDate"
        render={({ field: { value, onChange } }) => (
          <View>
            <Button
              onPress={() => setShowEndDatePicker(true)}
              variant="secondary"
            >
              {value ? `End Date: ${value.toLocaleDateString('en-IN')}` : 'Set End Date (Optional)'}
            </Button>
            <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
              <Text style={{ color: theme.palette.textSecondary, fontSize: 11 }}>
                Statement will end on this date. Leave empty to use today's date.
              </Text>
            </View>
            {errors.statementEndDate?.message && (
              <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
                <Text style={{ color: theme.palette.error, fontSize: 12 }}>
                  {errors.statementEndDate.message}
                </Text>
              </View>
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    // Normalize to local date at noon to avoid timezone issues
                    const normalized = new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      12, 0, 0, 0
                    );
                    onChange(normalized);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="startingBalance"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="Starting balance"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={(text) => onChange(Number(text) || 0)}
            helperText="Opening balance before first credit"
            error={errors.startingBalance?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="numberOfTransactions"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="Number of transactions"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={(text) => onChange(Number(text) || 0)}
            helperText={`Max ${periodValue === '3' ? '1000' : '5000'} for ${periodValue} months`}
            error={errors.numberOfTransactions?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="closingBalance"
        render={({ field: { value, onChange } }) => (
          <TextField
            label="Target closing balance (optional)"
            keyboardType="numeric"
            value={value !== undefined ? String(value) : ''}
            onChangeText={(text) => onChange(text ? Number(text) || 0 : undefined)}
            helperText="Leave empty for natural balance or specify target closing amount"
            error={errors.closingBalance?.message}
          />
        )}
      />
      <Button onPress={submit} isLoading={isLoading}>
        Generate statement
      </Button>
    </View>
  );
};
