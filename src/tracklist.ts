import store from './store';

export function initTrackList(element: HTMLElement) {
  const template = document.getElementById(
    'group-item-template'
  )! as HTMLTemplateElement;
  const trackTemplate = document.getElementById(
    'track-item-template'
  )! as HTMLTemplateElement;
  store.get.groups$.subscribe((groups) => {
    element.innerHTML = '';
    groups.forEach((group) => {
      const item = template.content
        .querySelector('div')!
        .cloneNode(true) as HTMLDivElement;
      item.onclick = () => {
        store.set.toggleGroupVisibility(group.id);
      };
      item.querySelector('.title')!.innerHTML = group.name;
      if (group.visible) {
        item.querySelector('.title')!.className = 'bold';
        item.style.backgroundColor = '#111111';
      }
      const list = item.querySelector('.tracks-container') as HTMLDivElement;
      group.tracks.forEach((track) => {
        const trackItem = trackTemplate.content
          .querySelector('div')!
          .cloneNode(true) as HTMLDivElement;
        const indicator = trackItem.querySelector(
          '.indicator'
        )! as HTMLDivElement;
        indicator.style.backgroundColor = track.color;
        indicator.innerText = track.symbol;
        trackItem.querySelector('.name')!.innerHTML = track.name;
        const distance = !track.length ? '–' : (track.length / 1000).toFixed(0);
        trackItem.querySelector('.distance')!.innerHTML = `${distance} km`;
        trackItem.querySelector('.info')!.innerHTML = track.info || '';
        list.appendChild(trackItem);
      });
      element.appendChild(item);
    });
  });
}
