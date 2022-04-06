import '../../css/app.css';
import { createMultiLocationMap } from './map';

// LiveReload server
if (ENV === 'development') {
  const script = document.createElement('script');
  script.src = `http://${
    (location.host || 'localhost').split(':')[0]
  }:35729/livereload.js?snipver=1`;
  document.head.append(script);
  console.log('Reload script added');
}

// Map
createMultiLocationMap();

// Menu
const closeMenu = document.querySelector('#close-menu');
const menu = document.querySelector('#menu');
const overlay = document.querySelector('.lp-overlay');
menu.addEventListener('click', (e) => {
  overlay.setAttribute('aria-expanded', true);
});

closeMenu.addEventListener('click', (e) => {
  overlay.setAttribute('aria-expanded', false);
});

overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('lp-overlay')) {
    overlay.setAttribute('aria-expanded', false);
  }
});
