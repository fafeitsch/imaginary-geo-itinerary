import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Subject,
} from 'rxjs';
import { Group, Itinerary, Medium } from './store.types';

interface State {
  name: string;
  groups: Group[];
  currentMedium: Medium | undefined;
  defaultCenter: {
    lat: number;
    lng: number;
    zoom: number;
  };
  info: { label: string; link: string };
  tiles: {
    server: string;
    attribution: string;
  };
  view: {
    itinerary: boolean;
    map: boolean;
    media: boolean;
  };
}

const state: State = {
  name: 'IGI',
  groups: [],
  currentMedium: undefined,
  defaultCenter: { lat: 0, lng: 0, zoom: 1 },
  info: { label: '', link: '' },
  tiles: {
    server: '',
    attribution: '',
  },
  view: {
    map: true,
    media: true,
    itinerary: true,
  },
};

const state$ = new BehaviorSubject<State>(state);
const events$ = new Subject<String>();

export default {
  get: {
    name$: state$.pipe(
      map((state) => state.name),
      distinctUntilChanged()
    ),
    info$: state$.pipe(
      map((state) => state.info),
      distinctUntilChanged()
    ),
    tiles$: state$.pipe(
      map((state) => state.tiles),
      distinctUntilChanged()
    ),
    groups$: state$.pipe(
      map((state) => state.groups),
      distinctUntilChanged()
    ),
    media$: state$.pipe(
      map((state) => selectedImages(state.groups)),
      distinctUntilChanged()
    ),
    currentMedium$: state$.pipe(
      map((state) => state.currentMedium),
      distinctUntilChanged()
    ),
    defaultCenter$: state$.pipe(
      map((state) => state.defaultCenter),
      distinctUntilChanged()
    ),
    mapVisible$: state$.pipe(
      map((state) => state.view.map),
      distinctUntilChanged()
    ),
    itineraryVisible$: state$.pipe(
      map((state) => state.view.itinerary),
      distinctUntilChanged()
    ),
    mediaVisible$: state$.pipe(
      map((state) => state.view.media),
      distinctUntilChanged()
    ),
  },
  set: {
    itinerary(itinerary: Itinerary) {
      const images = selectedImages(itinerary.groups);
      const currentImage = images.length > 0 ? images[0] : undefined;
      state$.next({
        ...state$.value,
        groups: itinerary.groups,
        currentMedium: currentImage,
        defaultCenter: itinerary.map,
        name: itinerary.name,
        info: itinerary.info || { link: '', label: '' },
        tiles: itinerary.tiles,
      });
    },
    trackLength(groupId: string, index: number, length: number) {
      const group = state$.value.groups.find((group) => group.id === groupId);
      if (!group) {
        return;
      }
      const tracks = [...group.tracks];
      tracks[index].length = length;
      const newGroup = {
        ...group,
        tracks,
      };
      state$.next({
        ...state$.value,
        groups: state$.value.groups.map((group) =>
          group.id === groupId ? newGroup : group
        ),
      });
    },
    currentImage(currentImage: Medium) {
      state$.next({ ...state$.value, currentMedium: currentImage });
    },
    nextImage() {
      selectImage(1);
    },
    previousImage() {
      selectImage(-1);
    },
    selectAllGroups() {
      const groups = [...state$.value.groups];
      groups.forEach((group) => (group.selected = true));
      const currentMedium = computeCurrentMedium(groups);
      state$.next({
        ...state$.value,
        groups,
        currentMedium,
      });
    },
    selectNoGroup() {
      const groups = [...state$.value.groups];
      groups.forEach((group) => (group.selected = false));
      state$.next({
        ...state$.value,
        groups,
        currentMedium: undefined,
      });
    },
    toggleVisibility(type: 'map' | 'itinerary' | 'media') {
      const view = { ...state$.value.view };
      view[type] = !view[type];
      const noneVisible = !(view.map || view.media || view.itinerary);
      view.media = noneVisible ? true : view.media;
      state$.next({ ...state$.value, view });
    },
    toggleGroupSelection(id: string) {
      let groups = state$.value.groups.map((group) =>
        group.id === id
          ? {
              ...group,
              selected: !group.selected,
            }
          : group
      );
      const currentMedium = computeCurrentMedium(groups);
      state$.next({
        ...state$.value,
        groups,
        currentMedium,
      });
    },
  },
  events: {
    triggerViewSettled() {
      events$.next('viewSettled');
    },
    viewSettled$: events$.pipe(filter((event) => event === 'viewSettled')),
  },
};

function computeCurrentMedium(groups: Group[]) {
  const images = selectedImages(groups);
  let currentImage = state$.value.currentMedium;
  if (images.every((image) => image.url !== state$.value.currentMedium?.url)) {
    currentImage = images.length > 0 ? images[0] : undefined;
  }
  return currentImage;
}

function selectedImages(groups: Group[]): Medium[] {
  return groups
    .filter((group) => group.selected)
    .map((group) => group.media)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

function selectImage(increment: number) {
  const images = selectedImages(state$.value.groups);
  const index = images.findIndex(
    (image) => image.url === state$.value.currentMedium?.url
  );
  let currentImage = undefined;
  increment =
    increment < 0 ? images.length + Math.abs(increment) - 2 : increment;
  if (index >= 0) {
    currentImage = images[(index + increment) % images.length];
  }
  state$.next({ ...state$.value, currentMedium: currentImage });
}
