import * as Yup from 'yup';

export const createBedSchema = Yup.object().shape({
  // bedNumber: Yup.string().min(1, 'Bed number is required').required('Bed number is required'),
  status: Yup.mixed().oneOf(['available', 'occupied', 'maintenance']).optional(),
  type: Yup.mixed().oneOf(['general', 'icu', 'ward']).required('Type is required'),
  ward: Yup.string().min(1, 'Ward is required').required('Ward is required'),
});

export const updateBedSchema = Yup.object().shape({
  bedNumber: Yup.string().min(1, 'Bed number is required').optional(),
  status: Yup.mixed().oneOf(['available', 'occupied', 'maintenance']).optional(),
  type: Yup.mixed().oneOf(['general', 'icu', 'ward']).optional(),
  ward: Yup.string().min(1, 'Ward is required').optional(),
});
