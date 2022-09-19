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
import { Group, Medium } from './store.types';

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
  leafletMap.on('click', (event) => {
    console.log([event.latlng.lat, event.latlng.lng]);
  });
  store.get.groups$.subscribe(addTrackLayers());
  store.get.currentMedium$.subscribe((currentMedium) => {
    centerOnCurrentMedium(currentMedium);
  });
  combineLatest([store.get.currentMedium$, store.get.media$]).subscribe(
    addMediaMarkers()
  );
  store.get.defaultCenter$.pipe(take(2)).subscribe((center) => {
    leafletMap.setView(center, center.zoom, { animate: false });
  });
  store.get.mapVisible$.subscribe((visible) => setMapVisible(visible));
  store.events.viewSettled$.subscribe(() => updateMapSize());
}

function addTrackLayers() {
  let trackLayers: Layer[] = [];
  return (groups: Group[]) => {
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
  };
}

function addMediaMarkers() {
  let imageMarkers: Marker[] = [];
  return ([currentMedium, media]: [Medium | undefined, Medium[]]) => {
    imageMarkers.forEach((layer) => leafletMap.removeLayer(layer));
    imageMarkers = media
      .filter((image) => image.location)
      .map((image) => {
        const color = currentMedium?.url === image.url ? '#000000' : '#656565';
        let markerHtmlStyles = `\n background-color: ${color}; width: 14px; height: 14px; display: block; position: relative; transform: rotate(45deg);`;
        let dataTest = 'map-active-marker';
        if (currentMedium?.url !== image.url) {
          markerHtmlStyles = markerHtmlStyles + ' border-radius: 7px 7px 0;';
          dataTest = 'map-marker';
        }
        const icon = divIcon({
          className: 'my-custom-pin',
          iconAnchor: [8, 19],
          html: `<span style='${markerHtmlStyles}' data-test="${dataTest}" />`,
        });
        const result = marker(image.location!, { icon }).on('click', () =>
          store.set.currentImage(image)
        );
        if (currentMedium?.url === image.url) {
          result.setZIndexOffset(1000);
        }
        return result;
      });
    imageMarkers.forEach((marker) => marker.addTo(leafletMap));
  };
}

function centerOnCurrentMedium(currentImage: Medium | undefined) {
  if (!currentImage?.location) {
    return;
  }
  leafletMap.setView(
    {
      lat: currentImage?.location[0],
      lng: currentImage?.location[1],
    },
    undefined,
    { animate: false }
  );
}

function showMap() {
  mapElement.classList.add('d-block');
  mapElement.classList.remove('d-none');
  updateMapSize();
}

function hideMap() {
  mapElement.classList.remove('d-block');
  mapElement.classList.add('d-none');
  updateMapSize();
}

function updateMapSize() {
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
function setMapVisible(visible: boolean) {
  if (visible) {
    showMap();
  } else {
    hideMap();
  }
}
