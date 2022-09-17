import store from './store';

let imageOutlet: HTMLImageElement = document.createElement('img');
imageOutlet.classList.add('w-100', 'h-100');
imageOutlet.style.objectFit = 'contain';

let videoOutlet: HTMLVideoElement = document.createElement('video');
videoOutlet.classList.add('w-100', 'h-100');
videoOutlet.controls = true;
videoOutlet.autoplay = true;
videoOutlet.setAttribute('controlslist', 'nofullscreen');

let mediaContainer: HTMLDivElement;

export function initImage() {
  mediaContainer = document.getElementById(
    'media-container'
  )! as HTMLDivElement;

  store.get.currentMedium$.subscribe((medium) => {
    if (!medium) {
      imageOutlet.src = 'itinerary/favicon.png';
      imageOutlet.alt =
        'Favicon placeholder image because no there is no image in the current selection.';
      if (mediaContainer.children.length > 0) {
        mediaContainer.replaceChild(imageOutlet, mediaContainer.children[0]);
      } else {
        mediaContainer.append(imageOutlet);
      }
      return;
    }

    if (medium.type === 'video') {
      videoOutlet.src = 'itinerary/' + medium.url;
      if (mediaContainer.children.length > 0) {
        mediaContainer.replaceChild(videoOutlet, mediaContainer.children[0]);
      } else {
        mediaContainer.append(videoOutlet);
      }
      videoOutlet.focus();
    } else {
      imageOutlet.src = 'itinerary/' + medium.url;
      imageOutlet.alt = medium.alt || '';
      if (mediaContainer.children.length > 0) {
        mediaContainer.replaceChild(imageOutlet, mediaContainer.children[0]);
      } else {
        mediaContainer.append(imageOutlet);
      }
      imageOutlet.focus();
    }
  });
  mediaContainer.addEventListener('click', () => store.set.nextImage());
}

export function showMedia(maxHeight: string) {
  mediaContainer.classList.add('d-flex');
  mediaContainer.classList.remove('d-none');
  mediaContainer.style.maxHeight = maxHeight;
}

export function hideMedia() {
  mediaContainer.classList.add('d-none');
  mediaContainer.classList.remove('d-flex');
}
