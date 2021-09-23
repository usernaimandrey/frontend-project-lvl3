import onChange from 'on-change';

const watchedState = (state, text) => onChange(state, (path, value) => {
  const feedBack = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('#rss');
  if (path === 'validationState') {
    switch (value) {
      case 'valid':
        input.classList.remove('is-invalid');
        feedBack.classList.remove('text-danger');
        feedBack.classList.add('text-success');
        feedBack.textContent = text.t('load.successful');
        form.reset();
        input.focus();
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        feedBack.classList.add('text-danger');
        feedBack.classList.remove('text-success');
        feedBack.textContent = text.t('valid.validError');
        break;
      default:
        throw new Error(`Unknow state ${value}`);
    }
  }
});

export default watchedState;
