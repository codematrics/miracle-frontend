import * as Yup from 'yup';

export const userSchema = Yup.object({
  firstName: Yup.string().min(1, { message: 'First Name is required' }),
  lastName: Yup.string().min(1, { message: 'Last Name is required' }),
  email: Yup.string().email(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
  // .test(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  // ),
  role: Yup.string(),
  isActive: Yup.boolean(),
});
