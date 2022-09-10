import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap, updateMapSize } from './map';
import store from './store';
import { initTrackList } from './tracklist';
import { skip } from 'rxjs';
import { Itinerary } from './store.types';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary: Itinerary) => {
    document.querySelector('title')!.innerHTML = itinerary.name;
    itinerary.groups.forEach((group) =>
      group.tracks.forEach((track) => {
        const type = itinerary.types[track.type];
        track.color = type?.color || '#000000';
        track.symbol = type?.symbol || '';
      })
    );
    store.set.itinerary(itinerary);
    console.log(itinerary);
    if (itinerary.info) {
      document.getElementById(
        'imprint'
      )!.innerHTML = `<a href=\"${itinerary.info.link}\" target=\"_blank\">${itinerary.info.label}</a>`;
    }
  });

initMap(document.getElementById('map')!);

const itineraryContainer = document.getElementById('itinerary')!;
initTrackList(itineraryContainer);

const imageContainer = document.getElementById('image-container')!;
const mapContainer = document.getElementById('map')!;
const infoOpener = document.getElementById('info-opener')!;
const appInfo = document.getElementById('app-info')!;
infoOpener.addEventListener('click', () => {
  appInfo.classList.toggle('d-none');
  appInfo.classList.toggle('d-flex');
});

const imageOutlet = document.querySelector(
  '#image-container > img'
)! as HTMLImageElement;
store.get.currentImage$.pipe(skip(1)).subscribe((image) => {
  if (!image) {
    showMap();
    imageOutlet.src = 'itinerary/favicon.png';
    return;
  }
  imageOutlet.src = 'itinerary/' + image.url;
});
imageOutlet.addEventListener('click', () => {
  store.set.nextImage();
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
    case 'Escape': {
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
    case 'F1': {
      appInfo.classList.toggle('d-none');
      appInfo.classList.toggle('d-flex');
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
  infoOpener.style.color = 'black';
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
  infoOpener.style.color = 'inherit';
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
  infoOpener.style.color = 'inherit';
}
