import store from './store';

let imageOutlet: HTMLImageElement;
let imageContainer: HTMLDivElement;

export function initImage() {
  imageContainer = document.getElementById(
    'image-container'
  )! as HTMLDivElement;
  imageOutlet = imageContainer.querySelector('img')! as HTMLImageElement;
  store.get.currentImage$.subscribe((image) => {
    if (!image) {
      imageOutlet.src = 'itinerary/favicon.png';
      return;
    }
    imageOutlet.src = 'itinerary/' + image.url;
  });
  imageOutlet.addEventListener('click', () => {
    store.set.nextImage();
  });
}

export function showImage(maxHeight: string) {
  imageContainer.classList.add('d-flex');
  imageContainer.classList.remove('d-none');
  imageContainer.style.maxHeight = maxHeight;
}

export function hideImage() {
  imageContainer.classList.add('d-none');
  imageContainer.classList.remove('d-flex');
}
