import * as Yup from 'yup';

export const createWardSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is Required'),
  status: Yup.mixed().oneOf(['active', 'inactive']).required('Status is Required'),
  type: Yup.mixed().oneOf(['general', 'icu', 'ward']).required('Type is required'),

  floor: Yup.object()
    .shape({
      value: Yup.string().required('Floor is required'),
      label: Yup.string(), // optional
    })
    .required('Floor is required'),
});

export const updateWardSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is Required'),
  status: Yup.mixed().oneOf(['active', 'inactive']).required('Status is Required'),
  type: Yup.mixed().oneOf(['general', 'icu', 'ward']).required('Type is required'),

  floor: Yup.object()
    .shape({
      value: Yup.string().required('Floor is required'),
      label: Yup.string(), // optional
    })
    .required('Floor is required'),
});
