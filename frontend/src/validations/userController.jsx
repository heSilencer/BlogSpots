import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  name: yup.string().required('\nName is required'),
  username: yup.string().required('\nUsername is required'),
  birthdate: yup.string().required('\nBirthdate is required'),
  email: yup.string().email('\nInvalid email').required('\nEmail is required'),
  role: yup.string().required('\nRole is required').oneOf(['user', 'admin'], '\nInvalid role'),
  password: yup.string().min(8, '\nPassword must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], '\nPasswords must match').required('\nConfirm password is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('\nInvalid email').required('\nEmail is required'),
  password: yup.string().required('\nPassword is required'),
});

export const productSchema = yup.object().shape({
  product_name: yup.string().required('\nProduct name is required'),
  product_description: yup.string().required('\nProduct description is required'),
  product_photo: yup.string().url('\nInvalid URL format').required('\nProduct photo URL is required'),
  product_qty: yup.number().integer('\nQuantity must be an integer').positive('\nQuantity must be positive').required('\nQuantity is required'),
});