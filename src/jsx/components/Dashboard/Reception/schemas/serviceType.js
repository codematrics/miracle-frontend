import * as Yup from 'yup';

export const createServiceTypeSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is Required'),
  serviceHead: Yup.string().min(1, 'Service Head is Required'),
});

export const updateServiceTypeSchema = Yup.object().shape({
  name: Yup.string().min(1, 'Name is Required').optional(),
  serviceHead: Yup.string().min(1, 'Service Head is Required'),
});
