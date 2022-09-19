import store from './store';

let itineraryContainer: HTMLDivElement;

export function initItinerary() {
  itineraryContainer = document.getElementById('itinerary') as HTMLDivElement;
  const template = document.getElementById(
    'group-item-template'
  )! as HTMLTemplateElement;
  const trackTemplate = document.getElementById(
    'track-item-template'
  )! as HTMLTemplateElement;
  store.get.groups$.subscribe((groups) => {
    itineraryContainer.innerHTML = '';
    groups.forEach((group) => {
      const item = template.content
        .querySelector('div')!
        .cloneNode(true) as HTMLDivElement;
      item.onclick = () => {
        store.set.toggleGroupSelection(group.id);
      };
      item.querySelector('.title')!.innerHTML = group.name;
      if (group.selected) {
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
      itineraryContainer.appendChild(item);
    });
    store.events.triggerViewSettled();
  });
  store.get.itineraryVisible$.subscribe((visible) => {
    if (visible) {
      showItinerary();
    } else {
      hideItinerary();
    }
    store.events.triggerViewSettled();
  });
}

export function showItinerary() {
  itineraryContainer.classList.add('d-flex');
  itineraryContainer.classList.remove('d-none');
}

export function hideItinerary() {
  itineraryContainer.classList.add('d-none');
  itineraryContainer.classList.remove('d-flex');
}
