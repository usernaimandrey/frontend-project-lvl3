const renderModal = (modal, { postPreView }) => {
  const { postTitle, postDescription, postLink } = postPreView;
  const title = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const button = document.querySelector('.full-article');

  const body = document.querySelector('body');
  body.classList.add('modal-open');
  body.setAttribute('style', 'overflow: hidden; padding-right: 15px;');

  modal.classList.add('show');
  modal.setAttribute('style', 'display: block;');
  modal.setAttribute('aria-modal', true);
  modal.setAttribute('role', 'dialog');
  modal.removeAttribute('aria-hidden');

  title.textContent = postTitle;
  modalBody.textContent = postDescription;
  button.setAttribute('href', postLink);
};
export default renderModal;
