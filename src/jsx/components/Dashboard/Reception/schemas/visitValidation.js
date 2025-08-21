import * as Yup from 'yup';

export const visitSchema = Yup.object().shape({
  // Required fields matching backend validation
  refby: Yup.string()
    .required('Referral source is required')
    .min(1, 'Referral source must be at least 1 character')
    .max(100, 'Referral source must be under 100 characters'),

  visitingdoctor: Yup.string()
    .required('Visiting Doctor is required'),

  visittype: Yup.string()
    .required('Visit Type is required')
    .min(1, 'Visit type must be at least 1 character')
    .max(50, 'Visit type must be under 50 characters'),

  mediclaim_type: Yup.string()
    .required('Insurance type is required')
    .min(1, 'Insurance type must be at least 1 character')
    .max(50, 'Insurance type must be under 50 characters'),

  // Optional fields
  visitdetail: Yup.string()
    .max(200, 'Visit notes must be under 200 characters')
    .nullable(),

  medicolegal: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid Medico Legal option')
    .nullable(),

  mediclaim_id: Yup.string()
    .when('mediclaim_type', {
      is: val => val && val !== 'Self', // if not "Self Payment"
      then: schema => schema.required('Policy/Card number is required'),
      otherwise: schema => schema.nullable(),
    }),
});

export const initialVisitValues = {
  refby: 'Self', // default to Self (matching backend format)
  visitingdoctor: '', // dropdown value
  visittype: 'OPD', // default to OPD
  visitdetail: '', // optional text
  medicolegal: 'No', // default radio selection
  mediclaim_type: 'Self', // default to Self (matching backend example)
  mediclaim_id: '', // required if mediclaim_type != "Self"
};
