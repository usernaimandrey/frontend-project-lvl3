const renderModal = (modal, { postPreView }) => {
  const { postTitle, postDescription, postLink } = postPreView;
  const title = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const button = document.querySelector('.full-article');

  title.textContent = postTitle;
  modalBody.textContent = postDescription;
  button.setAttribute('href', postLink);
};
export default renderModal;
