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

export default formControl;
