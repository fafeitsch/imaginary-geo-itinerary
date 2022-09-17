import {
  divIcon,
  latLng,
  Layer,
  map as LFMap,
  Map,
  Marker,
  marker,
  TileLayer,
  tileLayer,
} from 'leaflet';
// @ts-ignore
import * as LeafletGPX from 'leaflet-gpx/gpx';
import store from './store';
import 'leaflet/dist/images/marker-icon.png';
import { combineLatest, take } from 'rxjs';

let leafletMap: Map;
let mapElement: HTMLDivElement;
let tiles: TileLayer;

export function initMap() {
  mapElement = document.getElementById('map') as HTMLDivElement;
  leafletMap = LFMap(mapElement, { keyboard: false }).setView(
    latLng(50, 9),
    10
  );
  store.get.tiles$.subscribe((tilesInfo) => {
    if (tiles) {
      leafletMap.removeLayer(tiles);
    }
    if (tilesInfo?.server) {
      tiles = tileLayer(tilesInfo.server, {
        attribution: tilesInfo.attribution || '',
      }).addTo(leafletMap);
    }
  });
  let trackLayers: Layer[] = [];
  leafletMap.on('click', (event) => {
    console.log([event.latlng.lat, event.latlng.lng]);
  });
  store.get.groups$.subscribe((groups) => {
    trackLayers.forEach((layer) => leafletMap.removeLayer(layer));
    trackLayers = groups
      .filter((group) => group.selected)
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
    updateMapSize();
  });
  let imageMarkers: Marker[] = [];
  store.get.currentMedium$.subscribe((currentImage) => {
    if (currentImage && currentImage.location) {
      leafletMap.setView(
        {
          lat: currentImage?.location[0],
          lng: currentImage?.location[1],
        },
        undefined,
        { animate: false }
      );
    }
  });
  combineLatest([store.get.currentMedium$, store.get.images$]).subscribe(
    ([currentImage, images]) => {
      imageMarkers.forEach((layer) => leafletMap.removeLayer(layer));
      imageMarkers = images
        .filter((image) => image.location)
        .map((image) => {
          const color = currentImage?.url === image.url ? '#000000' : '#656565';
          let markerHtmlStyles = `\n background-color: ${color}; width: 14px; height: 14px; display: block; position: relative; transform: rotate(45deg);`;
          if (currentImage?.url !== image.url) {
            markerHtmlStyles = markerHtmlStyles + ' border-radius: 7px 7px 0;';
          }
          const icon = divIcon({
            className: 'my-custom-pin',
            iconAnchor: [8, 19],
            html: `<span style="${markerHtmlStyles}" />`,
          });
          const result = marker(image.location!, { icon }).on('click', () =>
            store.set.currentImage(image)
          );
          if (currentImage?.url === image.url) {
            result.setZIndexOffset(1000);
          }
          return result;
        });
      imageMarkers.forEach((marker) => marker.addTo(leafletMap));
    }
  );
  store.get.defaultCenter$.pipe(take(2)).subscribe((center) => {
    leafletMap.setView(center, center.zoom, { animate: false });
  });
}

export function showMap() {
  mapElement.classList.add('d-block');
  mapElement.classList.remove('d-none');
  updateMapSize();
}

export function hideMap() {
  mapElement.classList.remove('d-block');
  mapElement.classList.add('d-none');
  updateMapSize();
}

export function updateMapSize() {
  leafletMap.invalidateSize(false);
  store.get.currentMedium$.pipe(take(1)).subscribe((image) => {
    if (image && image.location) {
      leafletMap.setView(
        { lat: image.location[0], lng: image.location[1] },
        undefined,
        { animate: false }
      );
    }
  });
}
