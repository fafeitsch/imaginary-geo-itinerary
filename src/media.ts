import store from './store';
import { Medium } from './store.types';

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
      setFaviconFallbackImage();
    } else if (medium.type === 'video') {
      setVideoMedium(medium);
    } else {
      setImageMedium(medium);
    }
  });
  store.get.mapVisible$.subscribe((visible) => {
    mediaContainer.style.maxHeight = visible ? '64h' : '100vh';
  });
  store.get.mediaVisible$.subscribe((visible) => setMediaVisibility(visible));
  mediaContainer.addEventListener('click', () => store.set.nextImage());
}

function setFaviconFallbackImage() {
  imageOutlet.src = 'itinerary/favicon.png';
  imageOutlet.alt =
    'Favicon placeholder image because no there is no image in the current selection.';
  if (mediaContainer.children.length > 0) {
    mediaContainer.replaceChild(imageOutlet, mediaContainer.children[0]);
  } else {
    mediaContainer.append(imageOutlet);
  }
}

function setVideoMedium(medium: Medium) {
  videoOutlet.src = 'itinerary/' + medium.url;
  if (mediaContainer.children.length > 0) {
    mediaContainer.replaceChild(videoOutlet, mediaContainer.children[0]);
  } else {
    mediaContainer.append(videoOutlet);
  }
  videoOutlet.focus();
}

function setImageMedium(medium: Medium) {
  imageOutlet.src = 'itinerary/' + medium.url;
  imageOutlet.alt = medium.alt || '';
  if (mediaContainer.children.length > 0) {
    mediaContainer.replaceChild(imageOutlet, mediaContainer.children[0]);
  } else {
    mediaContainer.append(imageOutlet);
  }
  imageOutlet.focus();
}

function setMediaVisibility(visible: boolean) {
  if (visible) {
    mediaContainer.classList.add('d-flex');
    mediaContainer.classList.remove('d-none');
  } else {
    mediaContainer.classList.add('d-none');
    mediaContainer.classList.remove('d-flex');
  }
  store.events.triggerViewSettled();
}
