import { Track } from './store.types';
import store from './store';

export function initTrackList(element: HTMLElement, tracks: Track[]) {
  tracks
    .map((track) => {
      let visible = track.visible;
      const item = document.createElement('div');
      item.id = `track-item-${track.id}`;
      item.innerHTML = `<span>${track.name}</span>
        <div class=\"d-flex text-disabled\"><span class=\"distance\"></span> <span class=\"ml-2">km</span></div>`;
      item.className = 'd-flex flex-column pointer-cursor bold';
      item.onclick = () => {
        visible = !visible;
        if (visible) {
          item.className = item.className.replaceAll('bold', '').trim();
        } else {
          item.className = item.className + ' bold';
        }
        store.set.toggleTrackVisibility(track.url);
      };
      return item;
    })
    .forEach((item) => element.appendChild(item));
}
