const routes = {
  getRssPath: (value) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`,
};

export default routes;
