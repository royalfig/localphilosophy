import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  key: '3a0ecf83ab3136e0f43f4730d2',
  version: 'v4',
  url: 'https://localphilosophy-org.ghost.io',
});

const posts = api.posts.browse({ include: 'tags,authors' });

export default posts;
