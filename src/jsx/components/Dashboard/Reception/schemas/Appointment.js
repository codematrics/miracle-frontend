import * as Yup from 'yup';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const appointmentSchema = Yup.object().shape({
  patient: Yup.string().required('Patient is required'),
  doctor: Yup.string().required('Doctor is required'),
  appointmentDate: Yup.date()
    .min(today, 'Invalid appointment date')
    .required('Appointment date is required'),
  reason: Yup.string().required('Reason is required'),
});
