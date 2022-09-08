import { latLng, map as LFMap, Map, tileLayer } from 'leaflet';
// @ts-ignore
import * as LeafletGPX from 'leaflet-gpx/gpx';
import store from './store';
import 'leaflet/dist/images/marker-icon.png';

export function initMap(element: HTMLElement) {
  let leafletMap: Map = LFMap(element).setView(latLng(50, 9), 10);
  const url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  tileLayer(url).addTo(leafletMap);
  let trackLayers: any[] = [];
  store.get.tracks$.subscribe((tracks) => {
    trackLayers.forEach((layer) => leafletMap.removeLayer(layer));
    trackLayers = tracks
      .filter((track) => track.visible)
      .map((track) =>
        new LeafletGPX.GPX('itinerary/' + track.url, {
          async: true,
          polyline_options: { color: track.color },
          marker_options: {
            startIconUrl: '',
            endIconUrl: '',
            shadowIconUrl: '',
          },
        }).on('loaded', (gpx: LeafletGPX) => {
          const distanceElement = document.querySelector(
            `#track-item-${track.id} .distance`
          )!;
          console.log(distanceElement);
          distanceElement.innerHTML = (
            gpx.target.get_distance() / 1000
          ).toFixed(0);
        })
      );
    console.log(trackLayers);
    trackLayers.forEach((layer) => layer.addTo(leafletMap));
  });
}
