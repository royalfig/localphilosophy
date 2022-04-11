import * as JsSearch from 'js-search';
import posts from './api';

function searchResultTemplateRenderer(data) {
  const authors = data.authors.map((author) => author.name);
  const published = new Date(data.published_at);
  const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });
  return `
  <article class="lp-search-result">
  <h3><a href="/${data.slug}">${data.title}</a></h3>
  <div class="lp-search-result__meta">
    <p>by ${formatter.format(authors)} on ${new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(published)}</p>
  </div>
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
      searchResultsContainer.innerHTML = '';
      if (e.target.value.length > 2) {
        const results = searchInstance.search(e.target.value);

        if (!results.length) {
          searchResultsContainer.innerHTML = '<h3>No results... Try again?</h3>';
          return;
        }

        const searchResults = results.map((result) =>
          searchResultTemplateRenderer(result),
        );
        searchResultsContainer.innerHTML = searchResults.join('');
      }
    });
  });
}

export default search;
