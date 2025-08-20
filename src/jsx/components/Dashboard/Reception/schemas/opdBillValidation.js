import * as Yup from 'yup';

import { PAYMENT_MODES, PRIORITY } from '../../../../../constants/enums';

export const opdBillSchema = Yup.object().shape({
  refby: Yup.string().required('Ref By is required'),
  consultantDoctor: Yup.string().required('Consultant Doctor is required'),
  priority: Yup.mixed().oneOf(Object.values(PRIORITY)).required('Priority is required'),
  paymentMode: Yup.mixed().oneOf(Object.values(PAYMENT_MODES)).required('Payment Mode is required'),
  paidAmount: Yup.number()
    .min(0, 'Paid amount must be greater than or equal to 0')
    .required('Paid amount is required'),
});

export const initialOpdBillValues = {
  refby: '',
  consultantDoctor: '',
  priority: '1',
  paymentMode: '1',
  paidAmount: 0,
};
