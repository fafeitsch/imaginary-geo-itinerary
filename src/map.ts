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
import { combineLatest, take } from 'rxjs';

let leafletMap: Map;

export function initMap(element: HTMLElement) {
  leafletMap = LFMap(element).setView(latLng(50, 9), 10);
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
      if (currentImage) {
        leafletMap.setView(
          {
            lat: currentImage?.location[0],
            lng: currentImage?.location[1],
          },
          undefined,
          { animate: false }
        );
      }
      imageMarkers.forEach((layer) => leafletMap.removeLayer(layer));
      imageMarkers = images.map((image) => {
        const color = currentImage?.url === image.url ? '#FF0000' : '#b2b2b2';
        const markerHtmlStyles = `\n background-color: ${color}; width: 14px; height: 14px; display: block; left: -7px; top: -7px; position: relative; border-radius: 7px 7px 0; transform: rotate(45deg);`;
        const icon = divIcon({
          className: 'my-custom-pin',
          iconAnchor: [4, 9],
          html: `<span style="${markerHtmlStyles}" />`,
        });
        return marker(image.location, { icon }).on('click', () =>
          store.set.currentImage(image)
        );
      });
      imageMarkers.forEach((marker) => marker.addTo(leafletMap));
    }
  );
  store.get.defaultCenter$.pipe(take(2)).subscribe((center) => {
    leafletMap.setView(center, center.zoom, { animate: false });
  });
}

export function updateMapSize() {
  leafletMap.invalidateSize(false);
  store.get.currentImage$.pipe(take(1)).subscribe((image) => {
    if (image) {
      leafletMap.setView(
        { lat: image.location[0], lng: image.location[1] },
        undefined,
        { animate: false }
      );
    }
  });
}
