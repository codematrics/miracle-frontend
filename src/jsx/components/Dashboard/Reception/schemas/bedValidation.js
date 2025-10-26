import * as Yup from 'yup';

export const createBedSchema = Yup.object().shape({
  // bedNumber: Yup.string().min(1, 'Bed number is required').required('Bed number is required'),
  bedNumberFrom: Yup.number()
    .typeError('Bed Number From must be a number')
    .required('Bed Number From is required')
    .min(1, 'Bed Number From must be at least 1'),

  bedNumberTo: Yup.number()
    .typeError('Bed Number To must be a number')
    .required('Bed Number To is required')
    .min(1, 'Bed Number To must be at least 1')
    .test(
      'bedNumberTo-greater-or-equal',
      'Bed Number To must be greater than or equal to Bed Number From',
      function (value) {
        const { bedNumberFrom } = this.parent;
        return value >= bedNumberFrom;
      }
    ),
  status: Yup.mixed().oneOf(['available', 'occupied', 'maintenance']).optional(),
  ward: Yup.object()
    .shape({
      value: Yup.string().required('Ward is required'),
      label: Yup.string(), // optional
    })
    .required('Ward is required'),
  floor: Yup.object()
    .shape({
      value: Yup.string().required('Floor is required'),
      label: Yup.string(), // optional
    })
    .required('Floor is required'),
});

export const updateBedSchema = Yup.object().shape({
  bedNumber: Yup.string().min(1, 'Bed number is required').optional(),
  status: Yup.mixed().oneOf(['available', 'occupied', 'maintenance']).optional(),
  ward: Yup.object()
    .shape({
      value: Yup.string().required('Ward is required'),
      label: Yup.string(), // optional
    })
    .required('Ward is required'),
  floor: Yup.object()
    .shape({
      value: Yup.string().required('Floor is required'),
      label: Yup.string(), // optional
    })
    .required('Floor is required'),
});
