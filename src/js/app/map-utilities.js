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
  if (/unsplash/.test(featureImageUrl)) return featureImageUrl;
  const [domain, image] = featureImageUrl.split('images');
  return domain + 'images/size/w500' + image;
}

function isInViewport(popup, card) {
  // const clientWidth = document.documentElement.clientWidth;
  const cardAttributes = card.getBoundingClientRect();
  const popupAttributes = popup.getBoundingClientRect();

  const cardLeft = cardAttributes.left;
  const popupLeft = popupAttributes.left;

  const cardMiddle = cardAttributes.width / 2;
  const popupMiddle = popupAttributes.width / 2;

  card.scrollIntoView(false);
}

export {
  getMapIconUrl,
  parseLocation,
  createAuthorMarkup,
  createFeatureImageSize,
  isInViewport,
};
