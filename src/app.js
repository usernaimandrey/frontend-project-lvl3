import i18next from 'i18next';
import watched from './view.js';
import resources from './locales/index.js';
import validator from './validator.js';

export default () => {
  const defaultLng = 'ru';
  const state = {
    lng: defaultLng,
    fids: [],
    processState: 'filling', // filling, failed, processed
    validationState: '', // invalid valid
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = watched(state, i18nextInstance);

      const form = document.querySelector('#rss');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = formData.get('url');
        validator(value, i18nextInstance).then(() => {
          if (!watchedState.fids.includes(value)) {
            watchedState.fids.unshift(value);
            watchedState.validationState = 'valid';
          } else {
            watchedState.validationState = 'invalid';
          }
        }).catch(() => {
          watchedState.validationState = 'invalid';
        });
      });
    });
};
