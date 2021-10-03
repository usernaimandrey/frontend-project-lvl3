import onChange from 'on-change';
import renderFids from './render/renderFids.js';
import renderError from './render/renderError.js';
import renderPosts from './render/renderPosts.js';

const formControl = {
  disable: (input, button) => {
    input.setAttribute('disabled', 'disabled');
    button.setAttribute('disabled', 'disabled');
  },
  enable: (input, button) => {
    input.removeAttribute('disabled');
    button.removeAttribute('disabled');
  },
};

const watchedState = (state, text) => onChange(state, (path, value) => {
  const feedBack = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('#rss');
  const button = document.querySelector('[aria-label="add"]');
  const containerPosts = document.querySelector('.posts');
  const containerFeds = document.querySelector('.fids');
  if (path === 'proces.validationState') {
    if (value === 'invalid') {
      renderError(input, feedBack, text.t('valid.validError'));
    }
    if (value === 'duplication') {
      renderError(input, feedBack, text.t('duplication.error'));
    }
  }

  if (path === 'proces.processState') {
    switch (value) {
      case 'processed':
        feedBack.textContent = '';
        formControl.disable(input, button);
        break;
      case 'failed':
        formControl.enable(input, button);
        renderError(input, feedBack, text.t('load.networkErr'));
        break;
      case 'filling':
        formControl.enable(input, button);
        break;
      case 'successful':
        formControl.enable(input, button);
        break;
      default:
        throw new Error(`Unknow status ${value}`);
    }
  }

  if (path === 'proces.parsErro') {
    if (value === false && state.proces.processState === 'successful') {
      input.classList.remove('is-invalid');
      feedBack.classList.remove('text-danger');
      feedBack.classList.add('text-success');
      const textNode = document.createTextNode(text.t('load.successful'));
      feedBack.replaceChildren(textNode);
      renderFids(containerFeds, text.t('fids.fid'), state);
      renderPosts(containerPosts, text, state);
      form.reset();
      input.focus();
    } else if (value === true) {
      renderError(input, feedBack, text.t('parser.error'));
    }
  }

  if (path === 'proces.update') {
    if (value === 'loaded') {
      renderPosts(containerPosts, text, state);
    }
  }
});

export default watchedState;
