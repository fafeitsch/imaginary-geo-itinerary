import store from './store';

let imageOutlet: HTMLImageElement = document.createElement('img');
imageOutlet.classList.add('w-100', 'h-100');
imageOutlet.style.objectFit = 'contain';

let videoOutlet: HTMLVideoElement = document.createElement('video');
videoOutlet.classList.add('w-100', 'h-100');
videoOutlet.controls = true;

let mediaContainer: HTMLDivElement;

export function initImage() {
  mediaContainer = document.getElementById(
    'media-container'
  )! as HTMLDivElement;

  store.get.currentImage$.subscribe((media) => {
    if (!media) {
      imageOutlet.src = 'itinerary/favicon.png';
      imageOutlet.alt =
        'Favicon placeholder image because no there is no image in the current selection.';
      return;
    }

    if (media.type === 'video') {
      videoOutlet.src = 'itinerary/' + media.url;
      if (mediaContainer.children[0]) {
        mediaContainer.replaceChild(videoOutlet, mediaContainer.children[0]);
      } else {
        mediaContainer.append(videoOutlet);
      }
    } else {
      imageOutlet.src = 'itinerary/' + media.url;
      imageOutlet.alt = media.alt || '';
      if (mediaContainer.children[0]) {
        mediaContainer.replaceChild(imageOutlet, mediaContainer.children[0]);
      } else {
        mediaContainer.append(imageOutlet);
      }
    }
  });
  mediaContainer.addEventListener('click', () => {
    store.set.nextImage();
  });
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
