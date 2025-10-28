import * as yup from 'yup';

// Export ready-to-use common schemas; extend as needed

export const loginSchema = yup.object({
  email: yup.string().email().required('Email required'),
  password: yup.string().required('Password required')
});

export const postSchema = yup.object({
  title: yup.string().min(4).required(),
  content: yup.string().min(10).required(),
  categories: yup.array().of(yup.string().required()).min(1),
  tags: yup.array().of(yup.string()).min(1)
});

// You can add other validation schemas similarly
