import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  key: 'e8b32d10226f82ed257715582b',
  version: 'v4',
  url: 'http://localhost:2368',
});

const posts = api.posts.browse({ include: 'tags,authors' });

export default posts;
