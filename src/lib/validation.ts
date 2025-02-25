import * as Yup from 'yup';

const validationSchema = Yup.object({
  task: Yup.string().required('Masukkan kegiatan yang ingin kamu lakukan!')
});

export default validationSchema;