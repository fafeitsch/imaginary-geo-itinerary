import { latLng, map as LFMap, Map, tileLayer } from 'leaflet'
// @ts-ignore
import * as LeafletGPX from 'leaflet-gpx/gpx'
import store from './store'
import 'leaflet/dist/images/marker-icon.png'

export function initMap(element: HTMLElement) {
    let leafletMap: Map | undefined
    const url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    leafletMap = LFMap(element).setView(latLng(50, 9), 10)
    tileLayer(url).addTo(leafletMap)
    store.get.tracks$.subscribe((tracks) =>
        tracks.map((track) =>
            new LeafletGPX.GPX('itinerary/' + track.url, {
                async: true,
                polyline_options: { color: track.color },
                marker_options: {
                    startIconUrl: '',
                    endIconUrl: '',
                    shadowIconUrl: '',
                },
            }).addTo(leafletMap)
        )
    )
}
