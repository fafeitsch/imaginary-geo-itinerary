import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap, updateMapSize } from './map';
import store from './store';
import { initTrackList } from './tracklist';
import { skip } from 'rxjs';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary) => {
    document.querySelector('title')!.innerHTML = itinerary.name;
    store.set.itinerary(itinerary);
  });

initMap(document.getElementById('map')!);

const itineraryContainer = document.getElementById('tracks-container')!;
const imageContainer = document.getElementById('image-container')!;
const mapContainer = document.getElementById('map')!;

initTrackList(itineraryContainer);

const imageOutlet = document.querySelector(
  '#image-container > img'
)! as HTMLImageElement;
store.get.currentImage$.pipe(skip(1)).subscribe((image) => {
  if (!image) {
    showMap();
    return;
  }
  return (imageOutlet.src = 'itinerary/' + image.url);
});

const body = document.getElementsByTagName('body')[0];

body.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'm': {
      showMap();
      break;
    }
    case 'i': {
      showImage();
      break;
    }
    case 'b': {
      showAll();
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

function showMap() {
  imageContainer.classList.add('d-none');
  imageContainer.classList.remove('d-flex');
  mapContainer.classList.add('d-block');
  mapContainer.classList.remove('d-none');
  itineraryContainer.classList.add('d-flex');
  itineraryContainer.classList.remove('d-none');
  updateMapSize();
}

function showAll() {
  imageContainer.classList.add('d-flex');
  imageContainer.classList.remove('d-none');
  imageContainer.style.maxHeight = '64vh';
  mapContainer.classList.add('d-block');
  mapContainer.classList.remove('d-none');
  itineraryContainer.classList.add('d-flex');
  itineraryContainer.classList.remove('d-none');
  updateMapSize();
}

function showImage() {
  imageContainer.classList.add('d-flex');
  imageContainer.classList.remove('d-none');
  imageContainer.style.maxHeight = '100vh';
  mapContainer.classList.add('d-none');
  mapContainer.classList.remove('d-block');
  itineraryContainer.classList.add('d-none');
  itineraryContainer.classList.remove('d-flex');
}
