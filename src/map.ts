import {
  divIcon,
  latLng,
  Layer,
  map as LFMap,
  Map,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';
// @ts-ignore
import * as LeafletGPX from 'leaflet-gpx/gpx';
import store from './store';
import 'leaflet/dist/images/marker-icon.png';
import { combineLatest } from 'rxjs';

export function initMap(element: HTMLElement) {
  let leafletMap: Map = LFMap(element).setView(latLng(50, 9), 10);
  const url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  tileLayer(url).addTo(leafletMap);
  let trackLayers: Layer[] = [];
  leafletMap.on('click', (event) => {
    console.log([event.latlng.lat, event.latlng.lng]);
  });
  store.get.groups$.subscribe((groups) => {
    trackLayers.forEach((layer) => leafletMap.removeLayer(layer));
    trackLayers = groups
      .filter((group) => group.visible)
      .map((group) =>
        group.tracks.map((track, index) =>
          new LeafletGPX.GPX('itinerary/' + track.url, {
            async: true,
            polyline_options: { color: track.color },
            marker_options: {
              lapIconUrl: '',
              startIconUrl: '',
              endIconUrl: '',
              shadowIconUrl: '',
            },
          }).on('loaded', (gpx: LeafletGPX) => {
            if (track.length === undefined) {
              store.set.trackLength(group.id, index, gpx.target.get_distance());
            }
          })
        )
      )
      .reduce((acc, curr) => [...acc, ...curr], []);
    trackLayers.forEach((layer) => layer.addTo(leafletMap));
  });
  let imageMarkers: Marker[] = [];
  combineLatest([store.get.currentImage$, store.get.images$]).subscribe(
    ([currentImage, images]) => {
      leafletMap.setView({
        lat: currentImage?.location[0] || 0,
        lng: currentImage?.location[1] || 0,
      });
      imageMarkers.forEach((layer) => leafletMap.removeLayer(layer));
      imageMarkers = images.map((image) => {
        const color = currentImage?.url === image.url ? '#FF0000' : '#b2b2b2';
        const markerHtmlStyles = `\n background-color: ${color}; width: 25px; height: 25px; display: block; left: -12px; top: -12px; position: relative; border-radius: 25px 25px 0; transform: rotate(45deg);`;
        const icon = divIcon({
          className: 'my-custom-pin',
          iconAnchor: [0, 24],
          popupAnchor: [0, -36],
          html: `<span style="${markerHtmlStyles}" />`,
        });
        const m = marker(image.location, { icon }).on('click', () =>
          store.set.currentImage(image)
        );
        if (currentImage?.url === image.url) {
        }
        return m;
      });
      imageMarkers.forEach((marker) => marker.addTo(leafletMap));
    }
  );
}
