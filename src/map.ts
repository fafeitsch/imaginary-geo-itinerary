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
  store.get.groups$.subscribe((groups) => {
    trackLayers.forEach((layer) => leafletMap.removeLayer(layer));
    trackLayers = groups
      .filter((group) => group.visible)
      .map((group) =>
        group.tracks.map((track) =>
          new LeafletGPX.GPX('itinerary/' + track.url, {
            async: true,
            polyline_options: { color: track.color },
            marker_options: {
              startIconUrl: '',
              endIconUrl: '',
              shadowIconUrl: '',
            },
          }).on('loaded', (gpx: LeafletGPX) => {
            if (track.length === undefined) {
              store.set.trackLength(
                group.id,
                track.id,
                gpx.target.get_distance()
              );
            }
          })
        )
      )
      .reduce((acc, curr) => [...acc, ...curr], []);
    trackLayers.forEach((layer) => layer.addTo(leafletMap));
  });
}
