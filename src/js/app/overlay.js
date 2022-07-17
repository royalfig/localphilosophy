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
  const menuButton = document.querySelector('#menu-button');
  const closeButtons = document.querySelectorAll('.lp-close-button');

  document.body.addEventListener('keyup', (e) => {
    const openOverlay = document.querySelector(
      '.lp-overlay[aria-expanded=true]',
    );

    if (e.key === 'Escape' && openOverlay) {
      document.body.classList.remove('no-scroll');
      openOverlay.setAttribute('aria-expanded', 'false');
    }
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const overlay = e.currentTarget.closest('.lp-overlay');
      document.body.classList.remove('no-scroll');
      overlay.setAttribute('aria-expanded', 'false');
    });
  });

  menuButton.addEventListener('click', (e) => {
    const el = document.querySelector('#nav');
    document.body.classList.add('no-scroll');
    el.setAttribute('aria-expanded', true);
    const firstFocusableEl = el.querySelector('a');
    firstFocusableEl.focus();
  });
}

export default initOverlay;