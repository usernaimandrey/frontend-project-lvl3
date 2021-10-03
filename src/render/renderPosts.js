const renderPosts = (target, text, { posts }) => {
  const div = document.createElement('div');

  const h3 = document.createElement('h3');
  h3.textContent = text.t('posts.post');

  const list = document.createElement('ul');
  list.setAttribute('class', 'list-group mt-3');

  posts.forEach((el) => {
    const {
      fidByPostsId, postId, postTitle, postLink,
    } = el;

    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-baseline border-0 border-end-0');

    const link = document.createElement('a');
    link.setAttribute('id', postId);
    link.setAttribute('data-fid-Id', fidByPostsId);
    link.setAttribute('class', 'fw-bold'); // fw-normal link-secondary
    link.setAttribute('href', postLink);
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
    link.textContent = postTitle;

    const button = document.createElement('button');
    button.setAttribute('class', 'm-3 btn btn-outline-primary btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('id', postId);
    button.textContent = text.t('posts.button');

    li.append(link, button);
    list.append(li);
  });
  div.append(h3, list);
  target.replaceChildren(div);
};

export default renderPosts;
