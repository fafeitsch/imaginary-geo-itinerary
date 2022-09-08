import store from './store';

export function initImageOutlet(element: HTMLImageElement) {
  store.get.currentImage$.subscribe(
    (image) => (element.src = image?.url ? 'itinerary/' + image.url : '')
  );
  document.getElementById('next-image-button')!.onclick = () =>
    store.set.nextImage();
}
