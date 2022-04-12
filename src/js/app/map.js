import posts from './api';
import * as L from 'leaflet/dist/leaflet-src.esm';
import { PosAnimation } from 'leaflet';

const getMapIconUrl = () => {
  const mapPin = document.querySelector('[data-map-pin]');
  const mapPinShadow = document.querySelector('[data-map-pin-shadow]');

  return { mapPinIcon: mapPin.src, mapPinShadowIcon: mapPinShadow.src };
};

function parseLocation(input) {
  const locationWithoutPrefix = input.substring(3);
  const locationSplitOnComma = locationWithoutPrefix.split(',');
  const [first, second] = locationSplitOnComma;
  return [parseFloat(first), parseFloat(second)];
}

function createAuthorMarkup(authors) {
  const profileImage = (profileProp) => {
    return profileProp ? `<figure><img src="${profileProp}"></figure>` : '';
  };

  const authorMarkup = authors.map(
    (author) => `${profileImage(author.profile_image)}<p>${author.name}</p>`,
  );
  return `<div class="lp-popup-author">${authorMarkup.join('')}</div>`;
}

function createFeatureImageSize(featureImageUrl) {
  const [domain, image] = featureImageUrl.split('images');
  return domain + 'images/size/w300' + image;
}

function isInViewport(popup, card, cardContainer) {
  const clientWidth = document.documentElement.clientWidth;
  const cardAttributes = card.getBoundingClientRect();
  const popupAttributes = popup.getBoundingClientRect();

  const cardLeft = cardAttributes.left;
  const popupLeft = popupAttributes.left;

  const cardMiddle = cardAttributes.width / 2;
  const popupMiddle = popupAttributes.width / 2;
  const df = popupLeft + popupMiddle - cardLeft + cardMiddle;

  console.log(clientWidth - cardAttributes.width + cardAttributes.left);
  console.log(popup.getBoundingClientRect(), card.getBoundingClientRect());

  card.scrollIntoView(false);
  // if (cardLeft + cardAttributes.width > clientWidth) {
  //   cardContainer.scrollBy(clientWidth - cardLeft + cardAttributes.width, 0);
  // } else {
  //   cardContainer.scrollBy(0, 0);
  // }
}

// http://localhost:2368/content/images/size/w1000/2022/03/brooklyn-street-art-chip-thomas-arizona-11-20-web-1.jpg
// http://localhost:2368/content/images/2022/03/2048px-Downtown_Flagstaff_on_Art_Walk_-cropped-.jpg

function createMultiLocationMap() {
  let current;
  let markers = [];

  function setCurrent(id) {
    console.log(id);
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

  posts.then((data) => {
    const mapData = data.map((postData) => {
      const {
        title,
        url,
        feature_image,
        id,
        published_at,
        authors,
        tags,
        slug,
      } = postData;

      const [location, gc] = tags;

      const coords = parseLocation(gc.name);
      return {
        title,
        url,
        feature_image,
        id,
        published_at,
        authors,
        location_name: location.name,
        location_slug: location.url,
        coords,
        slug,
      };
    });

    const map = L.map('map').setView(mapData[0].coords, 15);

    map.on('click', () => {
      setCurrent(null);
    });

    const ACCESS_TOKEN =
      'pk.eyJ1Ijoicm95YWxmaWciLCJhIjoiY2t6M2Z2NzdpMDZlODJwbXpxbWF3ZWRybCJ9._5YW-t0-6Nfn_fav0TO8eg';

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`,
      {
        maxZoom: 18,
        id: 'mapbox/cjerxnqt3cgvp2rmyuxbeqme7',
        tileSize: 512,
        zoomOffset: -1,
      },
    ).addTo(map);

    const mapIcon = L.icon({
      iconUrl: getMapIconUrl().mapPinIcon,
      iconSize: [30, 30],
      iconAnchor: [15, 10],
      shadowUrl: getMapIconUrl().mapPinShadowIcon,
      shadowSize: [30, 30],
      shadowAnchor: [15, 10],
    });

    const width = document.documentElement.clientWidth > 500 ? 400 : 300;

    mapData.forEach((location, idx) => {
      const authors = createAuthorMarkup(location.authors);
      const m = L.marker(location.coords, { icon: mapIcon }).addTo(map);
      m.bindPopup(
        `<div class="lp-popup-content">
      <figure class="lp-popup-figure">
        <img src="${location.feature_image}" alt="">
      </figure>
      <div class="lp-popup-text">
        <h2>${location.title}</h2>
        <div class="lp-popup-meta">
        ${authors}
        <a href="/${location.slug}"><svg viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z"/><path d="M12 11V8l4 4-4 4v-3H8v-2h4zm0-9c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8z" fill="currentColor"/></svg></a>
        </div>
      </div>
      </div>`,
        { maxWidth: width, closeButton: false, id: location.slug },
      );
      markers.push(m);

      if (idx === 0) {
        m.openPopup();
        setCurrent(location.slug);
      }

      m.on('popupopen', (e) => {
        console.log(e);
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
  });
}

function createSingleLocationMap() {
  const mapData = document.getElementById('lp-post-map');
  const { gc } = mapData.dataset;
  const coords = parseLocation(gc);
  console.log(coords);
  const map = L.map('lp-post-map').setView(coords, 15);

  const ACCESS_TOKEN =
    'pk.eyJ1Ijoicm95YWxmaWciLCJhIjoiY2t6M2Z2NzdpMDZlODJwbXpxbWF3ZWRybCJ9._5YW-t0-6Nfn_fav0TO8eg';

  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`,
    {
      maxZoom: 18,
      id: 'mapbox/cjerxnqt3cgvp2rmyuxbeqme7',
      tileSize: 512,
      zoomOffset: -1,
    },
  ).addTo(map);

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
