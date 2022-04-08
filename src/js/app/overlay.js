// Menu
// const closeMenu = document.querySelector('#close-menu');
// const menu = document.querySelector('#menu');
// const overlay = document.querySelector('.lp-overlay');
// menu.addEventListener('click', (e) => {
//   overlay.setAttribute('aria-expanded', true);
// });

// closeMenu.addEventListener('click', (e) => {
//   overlay.setAttribute('aria-expanded', false);
// });

// overlay.addEventListener('click', (e) => {
//   if (e.target.classList.contains('lp-overlay')) {
//     overlay.setAttribute('aria-expanded', false);
//   }
// });
function initOverlay() {
  const searchButton = document.querySelector('#search-button');
  const menuButton = document.querySelector('#menu-button');
  const closeButtons = document.querySelectorAll('.lp-close-button');

  document.body.addEventListener('keyup', (e) => {
    const openOverlay = document.querySelector(
      '.lp-overlay[aria-expanded=true]',
    );

    if (e.key === 'Escape' && openOverlay) {
      openOverlay.setAttribute('aria-expanded', 'false');
    }
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const overlay = e.currentTarget.closest('.lp-overlay');
      overlay.setAttribute('aria-expanded', 'false');
    });
  });

  function findElement(srcButton) {
    console.log(srcButton.id, srcButton.id.startsWith('menu'));
    if (srcButton.id.startsWith('search')) {
      return document.querySelector('#search');
    }
    return document.querySelector('#nav');
  }

  searchButton.addEventListener('click', (e) => {
    const el = findElement(e.currentTarget);
    el.setAttribute('aria-expanded', true);
    const searchInput = el.querySelector('input');
    searchInput.focus();
  });

  menuButton.addEventListener('click', (e) => {
    const el = findElement(e.currentTarget);
    console.log(el);
    el.setAttribute('aria-expanded', true);
  });
}

export default initOverlay;
