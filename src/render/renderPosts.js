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
    li.setAttribute('class', 'list-group-item d-flex flex-row justify-content-between');
    li.setAttribute('id', postId);
    li.setAttribute('data-fidId', fidByPostsId);

    const link = document.createElement('a');
    link.setAttribute('class', 'nav-link');
    link.setAttribute('href', postLink);
    link.textContent = postTitle;

    const button = document.createElement('button');
    button.setAttribute('class', 'btn btn-outline-primary');
    button.setAttribute('type', 'button');
    button.textContent = text.t('posts.button');

    li.append(link, button);
    list.append(li);
  });
  div.append(h3, list);
  target.replaceChildren(div);
};

export default renderPosts;
