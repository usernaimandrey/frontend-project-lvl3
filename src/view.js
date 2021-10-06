import onChange from 'on-change';
import render from './render/index.js';
import formControl from './utils/formControl.js';

const watchedState = (state, text) => onChange(state, (path, value) => {
  const feedBack = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('#rss');
  const button = document.querySelector('[aria-label="add"]');
  const containerPosts = document.querySelector('.posts');
  const containerFeds = document.querySelector('.fids');
  const modal = document.querySelector('#modal');
  const {
    renderFids, renderPosts, renderError, renderModal,
  } = render;
  const { disable, enable } = formControl;

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
        disable(input, button);
        break;
      case 'failed':
        enable(input, button);
        renderError(input, feedBack, text.t('load.networkErr'));
        break;
      case 'filling':
        enable(input, button);
        break;
      case 'successful':
        enable(input, button);
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

  if (path === 'modal.modalView') {
    if (value === 'show') {
      renderModal(modal, state.modal);
    }
  }

  if (path === 'readPosts') {
    const { readPosts } = state;
    readPosts.forEach((id) => {
      const post = containerPosts.querySelector(`[data-id="${id}"]`);
      post.classList.remove('fw-bold');
      post.classList.add('fw-normal');
      post.classList.add('link-secondary');
    });
  }
});

export default watchedState;
