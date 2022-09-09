import store from './store';

export function initTrackList(element: HTMLElement) {
  const template = document.getElementById(
    'group-item-template'
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
      item.className = 'pointer-cursor';
      item.querySelector('.title')!.innerHTML = group.name;
      if (group.visible) {
        item.querySelector('.title')!.className = 'bold';
      }
      const list = item.querySelector('.tracks-container') as HTMLDivElement;
      group.tracks.forEach((track) => {
        const trackItem = document.createElement('div');
        const distance = !track.length ? '–' : (track.length / 1000).toFixed(0);
        trackItem.innerHTML = `<span>${track.name}</span>
        <div class=\"d-flex text-disabled\"><span>${distance} km</span></div>`;
        list.appendChild(trackItem);
      });
      element.appendChild(item);
    });
  });
}
