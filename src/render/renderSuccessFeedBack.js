const renderSuccessFeedBack = (input, feedBack, text) => {
  input.classList.remove('is-invalid');
  feedBack.classList.remove('text-danger');
  feedBack.classList.add('text-success');
  const textNode = document.createTextNode(text.t('load.successful'));
  feedBack.replaceChildren(textNode);
};

export default renderSuccessFeedBack;
