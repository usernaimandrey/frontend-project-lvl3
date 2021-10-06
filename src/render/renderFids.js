const renderFids = (target, text, { fids }) => {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = text;
  div.append(h3);

  const list = document.createElement('ul');
  list.setAttribute('class', 'list-group mt-3');

  fids.forEach((el) => {
    const { fidId, fidTitle, fidDescription } = el;
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.setAttribute('data-id', fidId);

    const h5 = document.createElement('h5');
    h5.textContent = fidTitle;

    const p = document.createElement('p');
    p.textContent = fidDescription;

    li.append(h5, p);
    list.append(li);
  });
  div.append(list);
  target.replaceChildren(div);
};

export default renderFids;
