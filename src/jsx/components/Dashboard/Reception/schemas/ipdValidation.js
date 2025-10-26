import * as yup from 'yup';

const createIPDSchema = yup.object().shape({
  bed: yup
    .object()
    .shape({
      value: yup.string().required('Bed is required'),
      label: yup.string(), // optional
    })
    .required('Bed is required'),

  services: yup
    .array()
    .of(
      yup.object({
        serviceId: yup.string().min(1, 'Service ID is required').required('Service ID is required'),
        quantity: yup
          .number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        price: yup.number().min(0, 'Price cannot be negative').required('Price is required'),
      })
    )
    .optional(),

  patient: yup
    .object()
    .shape({
      value: yup.string().required('Patient is required'),
      label: yup.string(), // optional
    })
    .required('Patient is required'),

  referringDoctor: yup
    .object()
    .shape({
      value: yup.string().required('Referring Doctor is required'),
      label: yup.string(), // optional
    })
    .required('Referring Doctor is required'),
  totalAmount: yup.number().min(0, 'Total amount cannot be negative').optional(),
  discount: yup.number().min(0, 'Discount cannot be negative').optional(),
  netAmount: yup.number().min(0, 'Net amount cannot be negative').optional(),
  paidAmount: yup.number().min(0, 'Paid amount cannot be negative').optional(),
});

const updateIPDSchema = yup.object().shape({
  bed: yup.string().min(1, 'Bed ID is required').optional(),
  services: yup
    .array()
    .of(
      yup.object({
        serviceId: yup.string().min(1, 'Service ID is required').required('Service ID is required'),
        quantity: yup
          .number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        price: yup.number().min(0, 'Price cannot be negative').required('Price is required'),
      })
    )
    .optional(),
  referringDoctor: yup.string().min(1, 'Referring Doctor ID is required').optional(),
  totalAmount: yup.number().min(0, 'Total amount cannot be negative').optional(),
  discount: yup.number().min(0, 'Discount cannot be negative').optional(),
  netAmount: yup.number().min(0, 'Net amount cannot be negative').optional(),
  paidAmount: yup.number().min(0, 'Paid amount cannot be negative').optional(),
  status: yup.string().oneOf(['In Treatment', 'Discharged']).optional(),
});

export { createIPDSchema, updateIPDSchema };
