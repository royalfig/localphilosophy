function shareDialogue(e) {
  const shareMenu = document.querySelector('.lp-share-menu');

  const title = e.target.dataset.name;
  const url = window.location;

  if (shareMenu.getAttribute('aria-expanded') === 'true') {
    shareMenu.setAttribute('aria-expanded', 'false');
    return;
  }

  if (navigator.share) {
    navigator
      .share({
        title,
        url,
      })
      .then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
  } else {
    shareMenu.setAttribute('aria-expanded', 'true');
  }
}

function share() {
  const shareButton = document.querySelector('#lp-share-button');

  if (!shareButton) return;

  shareButton.addEventListener('click', shareDialogue);
}

export default share;
