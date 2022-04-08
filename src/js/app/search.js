import * as JsSearch from 'js-search';
import posts from './api';

function searchResultTemplateRenderer(data) {
  const authors = data.authors.map((author) => `<p>${author.name}</p>`);
  const published = new Date(data.published_at);
  const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });
  return `
  <article class="lp-search-result">
  <h3><a href="/${data.slug}">${data.title}</a></h3>
  <p>${new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(published)}</p>
  <div class="lp-search-result__authors">${formatter.format(authors)}</div>
  </article>
  `;
}

function search() {
  posts.then((data) => {
    const input = document.querySelector('.lp-search-form input');
    const searchInstance = new JsSearch.Search('slug');
    searchInstance.addIndex('title');
    searchInstance.addIndex('plaintext');
    searchInstance.addIndex(['primary_author', 'name']);
    searchInstance.addIndex(['primary_tag', 'name']);
    searchInstance.addDocuments(data);
    const searchResultsContainer = document.querySelector('.lp-search-results');

    input.addEventListener('input', (e) => {
      if (e.target.value.length > 2) {
        const results = searchInstance.search(e.target.value);

        const searchResults = results.map((result) =>
          searchResultTemplateRenderer(result),
        );
        searchResultsContainer.innerHTML = searchResults.join('');
      }
    });
  });
}

export default search;
