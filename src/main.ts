import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap } from './map';
import store from './store';
import { initTrackList } from './tracklist';
import { Group, Track } from './store.types';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary) => {
    itinerary.groups.forEach((group: Group) => {
      group.tracks.forEach(
        (track: Track) =>
          (track.id = track.url.replaceAll('/', '').replaceAll('.', ''))
      );
    });
    store.set.itinerary(itinerary);
  });

initMap(document.getElementById('map')!);
initTrackList(document.getElementById('tracks-container')!);
