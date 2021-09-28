import i18next from 'i18next';
import axios from 'axios';
import watched from './view.js';
import resources from './locales/index.js';
import validator from './validator.js';
import parser from './parser.js';

const routes = {
  getRssPath: (value) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`,
};

export default () => {
  const defaultLng = 'ru';
  const state = {
    lng: defaultLng,
    links: [],
    fids: [],
    posts: [],
    proces: {
      processState: 'filling', // filling, failed, processed, successful
      validationState: '', // invalid valid
      parsErro: null,
    },
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
          if (!watchedState.links.includes(value)) {
            watchedState.links.push(value);
            watchedState.proces.validationState = 'valid';
          } else {
            watchedState.proces.validationState = 'duplication';
          }
        }).catch(() => {
          watchedState.proces.validationState = 'invalid';
        }).then(() => {
          if (watchedState.proces.validationState === 'valid') {
            watchedState.proces.processState = 'processed';
            axios.get(routes.getRssPath(value))
              .then((response) => {
                const data = parser(response.data.contents);
                if (!data) {
                  watchedState.proces.parsErro = true;
                  watchedState.links.splice(watchedState.links.length - 1, 1);
                } else {
                  const { fid, posts } = data;
                  watchedState.fids.unshift(fid);
                  watchedState.posts.unshift(...posts);
                  watchedState.proces.processState = 'successful';
                  watchedState.proces.parsErro = false;
                }
              })
              .catch(() => {
                watchedState.links.splice(watchedState.links.length - 1, 1);
                watchedState.proces.processState = 'failed';
              })
              .then(() => {
                watchedState.proces.parsErro = null;
                watchedState.proces.processState = 'filling';
                watchedState.proces.validationState = 'valid';
              });
          }
        });
      });
    });
};
