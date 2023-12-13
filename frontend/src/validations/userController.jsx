import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  name: yup.string().required('\nName is required'),
  username: yup.string().required('\nUsername is required'),
  birthdate: yup.string().required('\nBirthdate is required'),
  email: yup.string().email('\nInvalid email').required('\nEmail is required'),
  password: yup.string().min(8, '\nPassword must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], '\nPasswords must match').required('\nConfirm password is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('\nInvalid email').required('\nEmail is required'),
  password: yup.string().required('\nPassword is required'),
});

export const productSchema = yup.object().shape({
  title: yup.string().required('Blog name is required'),
  description: yup.string().required('Blog description is required'),
  image: yup.string().url('Invalid URL format').required('Product photo URL is required'),
  author: yup.string().required('Author is required'),
});