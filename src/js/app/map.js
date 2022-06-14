// import posts from './api';
import {
  getMapIconUrl,
  parseLocation,
  createAuthorMarkup,
  createFeatureImageSize,
  isInViewport,
} from './map-utilities';

import * as L from 'leaflet/dist/leaflet-src.esm';

const STYLE = 'cl1wfg8n8000015mpmwg2cdvw';

const ACCESS =
  'pk.eyJ1Ijoicm95YWxmaWciLCJhIjoiY2t6M2Z2NzdpMDZlODJwbXpxbWF3ZWRybCJ9._5YW-t0-6Nfn_fav0TO8eg';

const MAPBOX = `https://api.mapbox.com/styles/v1/royalfig/${STYLE}/tiles/{z}/{x}/{y}?access_token=${ACCESS}`;

function createMultiLocationMap() {
  let current;
  let markers = [];

  function setCurrent(id) {
    if (!id) {
      current && current.classList.remove('lp-current-card');
      current = id;
      return;
    }

    const article = document.getElementById(id);

    article.classList.add('lp-current-card');
    current && current.classList.remove('lp-current-card');
    current = article;
  }

  const cardContainer = document.querySelector('.lp-home-card-container');

  // If no cardContainer available, abort
  if (!cardContainer) return;

  const coords = parseLocation(postsForMap[0].gc);
  const zoom = type === 'post' ? 4 : 10;
  const map = L.map('map').setView(coords, zoom);

  map.on('click', () => {
    setCurrent(null);
  });

  L.tileLayer(MAPBOX, {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);

  const mapIcon = L.icon({
    iconUrl: getMapIconUrl().mapPinIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 10],
    shadowUrl: getMapIconUrl().mapPinShadowIcon,
    shadowSize: [30, 30],
    shadowAnchor: [15, 10],
  });

  const widths = () => {
    const clientWidth = document.documentElement.clientWidth;

    return {
      max: clientWidth > 550 ? 500 : 300,
      min: clientWidth < 300 ? clientWidth - 40 : 300,
    };
  };

  postsForMap.forEach((pin, idx) => {
    const authors = createAuthorMarkup(pin.authors);
    const m = L.marker(parseLocation(pin.gc), { icon: mapIcon }).addTo(map);
    m.bindPopup(
      `<div class="lp-popup-content">
      <figure class="lp-popup-figure">
        <img src="${createFeatureImageSize(pin.feature_image)}" alt="${
        pin.title
      }">
      </figure>
      <div class="lp-popup-text">
        <h2>${pin.title}</h2>
        <div class="lp-popup-meta">
        ${authors}
        <a href="/${
          pin.slug
        }"><svg viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z"/><path d="M12 11V8l4 4-4 4v-3H8v-2h4zm0-9c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8z" fill="currentColor"/></svg></a>
        </div>
      </div>
      </div>`,
      {
        maxWidth: widths().max,
        minWidth: widths().min,
        closeButton: false,
        id: pin.slug,
      },
    );
    markers.push(m);
    if (idx === 0) {
      m.openPopup();
      setCurrent(pin.slug);
    }

    m.on('popupopen', (e) => {
      const id = e.popup.options.id;
      setCurrent(id);
      const correspondingEl = document.getElementById(id);
      isInViewport(e.popup._container, correspondingEl, cardContainer);
    });
  });

  cardContainer.addEventListener('click', (e) => {
    const id = e.target.id || e.target?.closest('article')?.id;

    if (!id) {
      return;
    }

    const marker = markers.find((marker) => marker._popup.options.id === id);

    marker.openPopup();
  });
  // });
}

function createSingleLocationMap() {
  const mapData = document.getElementById('lp-post-map');
  const { gc } = mapData.dataset;
  const coords = parseLocation(gc);
  const map = L.map('lp-post-map').setView(coords, 16);

  L.tileLayer(MAPBOX, {
    maxZoom: 21,
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);

  const mapIcon = L.icon({
    iconUrl: getMapIconUrl().mapPinIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 10],
    shadowUrl: getMapIconUrl().mapPinShadowIcon,
    shadowSize: [30, 30],
    shadowAnchor: [15, 10],
  });

  const m = L.marker(coords, { icon: mapIcon }).addTo(map);
}

export { createMultiLocationMap, createSingleLocationMap };
