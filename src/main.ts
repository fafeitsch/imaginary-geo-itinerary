import './style.css'
import 'leaflet/dist/leaflet.css'
import { initMap } from './map'
import store from './store'

fetch('itinerary/index.json')
    .then((response) => response.json())
    .then((intinerary) => {
        store.set.tracks(intinerary.tracks)
    })

initMap(document.getElementById('map')!)
