import * as Yup from 'yup';

import { PAYMENT_MODES, PRIORITY } from '../../../../../constants/enums';

export const opdBillSchema = Yup.object().shape({
  // Required fields matching backend validation
  refby: Yup.string()
    .required('Referral source is required')
    .min(1, 'Referral source must be at least 1 character'),
  
  consultantDoctor: Yup.string()
    .required('Consultant Doctor is required'),
  
  // Optional fields with defaults
  priority: Yup.mixed()
    .oneOf([...Object.values(PRIORITY), ''], 'Invalid priority')
    .nullable(),
  
  paymentMode: Yup.mixed()
    .oneOf([...Object.values(PAYMENT_MODES), ''], 'Invalid payment mode')
    .nullable(),
  
  paidAmount: Yup.number()
    .min(0, 'Paid amount must be greater than or equal to 0')
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value;
    }),
});

export const initialOpdBillValues = {
  refby: 'Self',
  consultantDoctor: '',
  priority: PRIORITY.NORMAL,
  paymentMode: PAYMENT_MODES.CASH,
  paidAmount: 0,
};
