import onChange from 'on-change';

const renderError = (elementInput, target, text) => {
  elementInput.classList.add('is-invalid');
  target.classList.add('text-danger');
  target.classList.remove('text-success');
  const textNode = document.createTextNode(text);
  target.replaceChildren(textNode);
};

const watchedState = (state, text) => onChange(state, (path, value) => {
  const feedBack = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('#rss');
  if (path === 'proces.validationState') {
    if (value === 'invalid') {
      renderError(input, feedBack, text.t('valid.validError'));
    }
    if (value === 'duplication') {
      renderError(input, feedBack, text.t('duplication.error'));
    }
  }

  if (path === 'proces.processState') {
    if (value === 'failed') {
      renderError(input, feedBack, text.t('load.networkErr'));
    }
  }

  if (path === 'proces.parsErro') {
    if (!value && state.proces.processState === 'successful') {
      input.classList.remove('is-invalid');
      feedBack.classList.remove('text-danger');
      feedBack.classList.add('text-success');
      const textNode = document.createTextNode(text.t('load.successful'));
      feedBack.replaceChildren(textNode);
      form.reset();
      input.focus();
    } else {
      renderError(input, feedBack, text.t('parser.error'));
    }
  }
});

export default watchedState;
