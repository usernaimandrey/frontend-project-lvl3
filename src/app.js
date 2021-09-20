import * as yup from 'yup';
import watched from './view.js';

const schema = yup
  .string()
  .trim()
  .required('Ссылка должна быть валидным URL')
  .url('Ссылка должна быть валидным URL');

export default () => {
  const state = {
    fids: [],
    processState: 'filling', // filling, failed, processed
    validationState: '', // invalid valid
    validationErr: '',
    networkErr: '',
  };

  const watchedState = watched(state);

  const form = document.querySelector('#rss');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    schema.validate(value).then(() => {
      if (!watchedState.fids.includes(value)) {
        watchedState.validationErr = '';
        watchedState.fids.unshift(value);
        watchedState.validationState = 'valid';
      } else {
        watchedState.validationErr = 'Ссылка должна быть валидным URL';
        watchedState.validationState = 'invalid';
      }
    }).catch((error) => {
      watchedState.validationErr = error.message;
      watchedState.validationState = 'invalid';
    });
  });
};
