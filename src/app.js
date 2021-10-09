import i18next from 'i18next';
import _ from 'lodash';
import axios from 'axios';
import watched from './view.js';
import resources from './locales/index.js';
import validator from './validator.js';
import parser from './parser.js';
import routes from './utils/routes.js';

export default () => {
  const defaultLng = 'ru';
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      const state = {
        lng: defaultLng,
        links: [],
        fids: [],
        posts: [],
        readPosts: [],
        modal: {
          modalView: 'hidden', // show
          postPreView: {},
        },
        id: {
          post: 0,
          fid: 0,
        },
        proces: {
          processState: 'filling', // filling, failed, processed, successful
          validationState: '', // invalid valid
          parsErro: null,
          update: null, // loading, loaded
          countCall: 0,
        },
      };

      const watchedState = watched(state, i18nextInstance);
      const form = document.querySelector('#rss');
      const containerPosts = document.querySelector('.posts');

      const updatePosts = () => {
        watchedState.proces.update = 'loading';
        setTimeout(() => {
          const request = (path) => axios.get(routes.getRssPath(path))
            .then((response) => parser(response.data.contents))
            .then(({ posts }) => posts);
          Promise.all(watchedState.links.map((link) => request(link)))
            .then((data) => {
              const result = data.flat();
              const diff = _.differenceWith(result, watchedState.posts, _.isEqual);
              watchedState.posts.unshift(...diff);
              watchedState.proces.update = 'loaded';
              updatePosts();
            })
            .catch((e) => {
              console.log(e);
              watchedState.proces.update = 'loading';
              updatePosts();
            });
        }, 5000);
      };

      containerPosts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        const { type } = e.target;
        if (id && !watchedState.readPosts.includes(id)) {
          watchedState.readPosts.push(id);
        }

        if (type === 'button') {
          const postPreView = watchedState.posts.find((element) => element.postId === id);
          watchedState.modal.postPreView = { ...postPreView };
          watchedState.modal.modalView = 'show';
          watchedState.modal.modalView = 'hidden';
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = formData.get('url');
        validator(value, i18nextInstance).then(() => {
          if (!watchedState.links.includes(value)) {
            watchedState.links.unshift(value);
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
                  throw new Error('parsErro');
                } else {
                  const { fid, posts } = data;
                  watchedState.fids.unshift(fid);
                  watchedState.posts.unshift(...posts);

                  watchedState.proces.processState = 'successful';
                  watchedState.proces.parsErro = false;
                  watchedState.proces.update = 'loading';
                  watchedState.proces.countCall += 1;
                  if (watchedState.proces.countCall < 2) {
                    updatePosts();
                  }
                }
              })
              .catch((error) => {
                const { message } = error;
                watchedState.links.splice(watchedState.links[0], 1);
                if (message === 'parsErro') {
                  watchedState.proces.parsErro = true;
                }
                if (message === 'Network Error') {
                  watchedState.proces.processState = 'failed';
                }
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
