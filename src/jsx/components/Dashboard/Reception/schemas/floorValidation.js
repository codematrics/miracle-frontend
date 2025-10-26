import * as Yup from 'yup';

export const createFloorSchema = Yup.object().shape({
  status: Yup.mixed().oneOf(['active', 'inactive']).required('Status is Required'),
  name: Yup.string().min(1, 'Name is Required'),
});

export const updateFloorSchema = Yup.object().shape({
  status: Yup.mixed().oneOf(['active', 'inactive']).optional(),
  name: Yup.string().min(1, 'Name is Required').optional(),
});
