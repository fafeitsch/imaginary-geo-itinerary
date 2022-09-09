import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap } from './map';
import store from './store';
import { initTrackList } from './tracklist';
import { initImageOutlet } from './image';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary) => {
    document.querySelector('title')!.innerHTML = itinerary.name;
    store.set.itinerary(itinerary);
  });

initMap(document.getElementById('map')!);
initTrackList(document.getElementById('tracks-container')!);
initImageOutlet(document.getElementById('image-outlet')! as HTMLImageElement);

const imageContainer = document.getElementById('image-container')!;
const mapContainer = document.getElementById('map')!;

const body = document.getElementsByTagName('body')[0];
body.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'm': {
      imageContainer.classList.add('d-none');
      imageContainer.classList.remove('d-flex');
      mapContainer.classList.add('d-block');
      mapContainer.classList.remove('d-none');
      break;
    }
    case 'i': {
      imageContainer.classList.add('d-flex');
      imageContainer.classList.remove('d-none');
      imageContainer.style.maxHeight = '100vh';
      mapContainer.classList.add('d-none');
      mapContainer.classList.remove('d-block');
      break;
    }
    case 'b': {
      imageContainer.classList.add('d-flex');
      imageContainer.classList.remove('d-none');
      imageContainer.style.maxHeight = '64vh';
      mapContainer.classList.add('d-block');
      mapContainer.classList.remove('d-none');
      break;
    }
    case 'ArrowRight':
    case ' ': {
      store.set.nextImage();
      break;
    }
    case 'ArrowLeft': {
      store.set.previousImage();
      break;
    }
  }
});
