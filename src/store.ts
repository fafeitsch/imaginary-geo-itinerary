import { BehaviorSubject, distinct, map } from 'rxjs';
import { Group, Image, Itinerary } from './store.types';

interface State {
  groups: Group[];
  currentImage: Image | undefined;
  defaultCenter: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

const state: State = {
  groups: [],
  currentImage: undefined,
  defaultCenter: { lat: 0, lng: 0, zoom: 1 },
};

const state$ = new BehaviorSubject<State>(state);

function selectedImages(groups: Group[]): Image[] {
  return groups
    .filter((group) => group.visible)
    .map((group) => group.images)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

function selectImage(increment: number) {
  const images = selectedImages(state$.value.groups);
  const index = images.findIndex(
    (image) => image.url === state$.value.currentImage?.url
  );
  let currentImage = undefined;
  increment = increment < 0 ? images.length + Math.abs(increment) : increment;
  if (index >= 0) {
    currentImage = images[(index + increment) % images.length];
  }
  state$.next({ ...state$.value, currentImage });
}

export default {
  get: {
    groups$: state$.pipe(
      map((state) => state.groups),
      distinct()
    ),
    images$: state$.pipe(map((state) => selectedImages(state.groups))),
    currentImage$: state$.pipe(
      map((state) => state.currentImage),
      distinct()
    ),
    defaultCenter$: state$.pipe(
      map((state) => state.defaultCenter),
      distinct()
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
    currentImage(currentImage: Image) {
      state$.next({ ...state$.value, currentImage });
    },
    nextImage() {
      selectImage(1);
    },
    previousImage() {
      selectImage(-1);
    },
    toggleGroupVisibility(id: string) {
      let groups = state$.value.groups.map((group) =>
        group.id === id
          ? {
              ...group,
              visible: !group.visible,
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
