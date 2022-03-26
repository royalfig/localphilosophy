import posts from './api';
import * as L from 'leaflet/dist/leaflet-src.esm';

let current;
let markers = [];
const cardContainer = document.querySelector('.lp-home-card-container');

const getMapIconUrl = () => {
  const mapPin = document.querySelector('[data-map-pin]');
  const mapPinShadow = document.querySelector('[data-map-pin-shadow]');

  return { mapPinIcon: mapPin.src, mapPinShadowIcon: mapPinShadow.src };
};

const map = posts.then((data) => {
  const mapData = data.map((postData) => {
    const { title, url, feature_image, id, published_at, authors, tags, slug } =
      postData;

    const [location, gc] = tags;
    console.log(authors);
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

  const map = L.map('map').setView(mapData[0].coords, 13);

  map.on('click', () => {
    setCurrent(null);
  });

  const ACCESS_TOKEN =
    'pk.eyJ1Ijoicm95YWxmaWciLCJhIjoiY2t6M2Z2NzdpMDZlODJwbXpxbWF3ZWRybCJ9._5YW-t0-6Nfn_fav0TO8eg';

  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`,
    {
      attribution: `Map data &copy; <a
  href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
  contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
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

  L.popup({ maxWidth: 400 });

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
        <a href="${location.url}"><svg viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z"/><path d="M12 11V8l4 4-4 4v-3H8v-2h4zm0-9c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8z" fill="currentColor"/></svg></a>
        </div>
      </div>
      </div>`,
      { maxWidth: 400, closeButton: false, id: location.slug },
    );
    markers.push(m);

    if (idx === 0) {
      m.openPopup();
      setCurrent(location.slug);
    }

    m.on('popupopen', (e) => {
      const id = e.popup.options.id;
      setCurrent(id);
      const correspondingEl = document.getElementById(id);
      isInViewport(correspondingEl);
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

function parseLocation(input) {
  const locationWithoutPrefix = input.substring(3);
  const locationSplitOnComma = locationWithoutPrefix.split(',');
  const [first, second] = locationSplitOnComma;
  return [parseFloat(first), parseFloat(second)];
}

function createAuthorMarkup(authors) {
  const profileImage = (profileProp) => {
    return profileProp
      ? `<img src="${profileProp}">`
      : `<svg viewBox="0 0 24 24" ><path fill="none" d="M0 0h24v24H0z"/><path d="M17.084 15.812a7 7 0 1 0-10.168 0A5.996 5.996 0 0 1 12 13a5.996 5.996 0 0 1 5.084 2.812zM12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zM12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="currentColor"/></svg>`;
  };

  const authorMarkup = authors.map(
    (author) =>
      `<figure>${profileImage(author.profile_image)}</figure><p>${
        author.name
      }</p>`,
  );
  return `<div class="lp-popup-author">${authorMarkup.join('')}</div>`;
}

function createFeatureImageSize(featureImageUrl) {
  const [domain, image] = featureImageUrl.split('images');
  return domain + 'images/size/w300' + image;
}

function setCurrent(id) {
  if (!id) {
    console.log(id);
    current && current.classList.remove('lp-current-card');

    current = id;
    return;
  }

  const article = document.getElementById(id);

  article.classList.add('lp-current-card');
  current && current.classList.remove('lp-current-card');
  current = article;
}

function isInViewport(el) {
  const clientWidth = document.documentElement.clientWidth;
  const { x, width } = el.getBoundingClientRect();

  const startOfEl = x;
  const endOfEl = x + width;

  if (startOfEl < clientWidth || endOfEl > clientWidth) {
    cardContainer.scrollBy({
      left: endOfEl - clientWidth,
      behavior: 'smooth',
    });
  }
  console.log({
    startOfEl,
    endOfEl,
    clientWidth,
    scrollW: cardContainer.scrollWidth,
    scrolled: endOfEl - clientWidth,
  });

  // if (x + width > clientWidth) {
  //   console.log(el);
  //   cardContainer.scrollBy(clientWidth - x + width, 0);
  // } else {
  //   cardContainer.scrollBy(0, 0);
  // }
}

export default map;

// http://localhost:2368/content/images/size/w1000/2022/03/brooklyn-street-art-chip-thomas-arizona-11-20-web-1.jpg
// http://localhost:2368/content/images/2022/03/2048px-Downtown_Flagstaff_on_Art_Walk_-cropped-.jpg
