import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { Group, Medium, Itinerary } from './store.types';

interface State {
  name: string;
  groups: Group[];
  currentImage: Medium | undefined;
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
}

const state: State = {
  name: 'IGI',
  groups: [],
  currentImage: undefined,
  defaultCenter: { lat: 0, lng: 0, zoom: 1 },
  info: { label: '', link: '' },
  tiles: {
    server: '',
    attribution: '',
  },
};

const state$ = new BehaviorSubject<State>(state);

function selectedImages(groups: Group[]): Medium[] {
  return groups
    .filter((group) => group.selected)
    .map((group) => group.media)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

function selectImage(increment: number) {
  const images = selectedImages(state$.value.groups);
  const index = images.findIndex(
    (image) => image.url === state$.value.currentImage?.url
  );
  let currentImage = undefined;
  increment =
    increment < 0 ? images.length + Math.abs(increment) - 2 : increment;
  if (index >= 0) {
    currentImage = images[(index + increment) % images.length];
  }
  state$.next({ ...state$.value, currentImage });
}

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
    images$: state$.pipe(
      map((state) => selectedImages(state.groups)),
      distinctUntilChanged()
    ),
    currentImage$: state$.pipe(
      map((state) => state.currentImage),
      distinctUntilChanged()
    ),
    defaultCenter$: state$.pipe(
      map((state) => state.defaultCenter),
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
        currentImage,
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
      state$.next({ ...state$.value, currentImage });
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
      state$.next({ ...state$.value, groups });
    },
    selectNoGroup() {
      const groups = [...state$.value.groups];
      groups.forEach((group) => (group.selected = false));
      state$.next({ ...state$.value, groups });
    },
    toggleGroupVisibility(id: string) {
      let groups = state$.value.groups.map((group) =>
        group.id === id
          ? {
              ...group,
              selected: !group.selected,
            }
          : group
      );
      const images = selectedImages(groups);
      let currentImage = state$.value.currentImage;
      if (
        images.every((image) => image.url !== state$.value.currentImage?.url)
      ) {
        currentImage = images.length > 0 ? images[0] : undefined;
      }
      state$.next({
        ...state$.value,
        groups,
        currentImage,
      });
    },
  },
};
