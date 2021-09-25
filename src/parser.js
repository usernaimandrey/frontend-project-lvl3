import uniqueId from 'lodash/uniqueId.js';

const parser = (data) => {
  const pars = new DOMParser();
  const xml = pars.parseFromString(data, 'application/xml');
  const parserErro = xml.querySelector('parsererror');
  if (parserErro) {
    return null;
  }
  const fidId = uniqueId();
  const fidTitle = xml.querySelector('title').textContent.trim();
  const fidDescription = xml.querySelector('description').textContent.trim();
  const fid = { fidId, fidTitle, fidDescription };
  const itemPosts = Array.from(xml.querySelectorAll('item'));
  const posts = [];
  itemPosts.forEach((post) => {
    const fidByPostsId = fidId;
    const postId = uniqueId();
    const postTitle = post.querySelector('title').textContent.trim();
    const postDescription = post.querySelector('description').textContent.trim();
    const postLink = post.querySelector('link').textContent.trim();
    posts.push({
      fidByPostsId, postId, postTitle, postDescription, postLink,
    });
  });
  return { fid, posts };
};

export default parser;
