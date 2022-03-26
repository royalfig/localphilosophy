import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  key: '385060693c5636655f296c5de0',
  version: 'v4',
  url: 'http://localhost:2368',
});

const posts = api.posts.browse({ include: 'tags,authors' });

export default posts;
