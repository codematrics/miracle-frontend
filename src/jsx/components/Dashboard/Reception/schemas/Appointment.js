import * as Yup from 'yup';

export const appointmentSchema = Yup.object().shape({
  patient: Yup.string().required('Patient is required'),
  doctor: Yup.string().required('Doctor is required'),
  appointmentDate: Yup.date()
    .min(new Date(), 'Invalid appointment date')
    .required('Appointment date is required'),
  reason: Yup.string().required('Reason is required'),
});
