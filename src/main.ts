import './style.scss';
import 'leaflet/dist/leaflet.css';
import { initMap } from './map';
import store from './store';
import { initTrackList } from './tracklist';
import { Track } from './store.types';

fetch('itinerary/index.json')
  .then((response) => response.json())
  .then((itinerary) => {
    itinerary.tracks.forEach(
      (track: Track) =>
        (track.id = track.url.replaceAll('/', '').replaceAll('.', ''))
    );
    store.set.tracks(itinerary.tracks);
    initTrackList(
      document.getElementById('tracks-container')!,
      itinerary.tracks
    );
  });

initMap(document.getElementById('map')!);
