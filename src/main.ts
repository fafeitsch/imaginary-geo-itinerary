import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap } from './map';
import store from './store';
import { initItinerary } from './itinerary';
import { Itinerary } from './store.types';
import { initImage } from './media';
import { initAppInfo, toggleAppInfo } from './app-info';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary: Itinerary) => {
    itinerary.groups.forEach((group) =>
      group.tracks.forEach((track) => {
        const type = itinerary.types[track.type];
        track.color = type?.color || '#000000';
        track.symbol = type?.symbol || '';
      })
    );
    store.set.itinerary(itinerary);
  });

initMap();
initImage();
initItinerary();
initAppInfo();

const body = document.getElementsByTagName('body')[0];

body.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a': {
      store.set.selectAllGroups();
      break;
    }
    case 'n': {
      store.set.selectNoGroup();
      break;
    }
    case 'm': {
      store.set.toggleVisibility('map');
      break;
    }
    case 'i': {
      store.set.toggleVisibility('media');
      break;
    }
    case 'l': {
      store.set.toggleVisibility('itinerary');
      break;
    }
    case 'ArrowRight': {
      store.set.nextImage();
      break;
    }
    case 'ArrowLeft': {
      store.set.previousImage();
      break;
    }
    case 'h':
    case 'F1': {
      toggleAppInfo();
      break;
    }
  }
});
