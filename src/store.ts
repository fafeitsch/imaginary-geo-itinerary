import {
  BehaviorSubject,
  distinct,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { Group, Image, Itinerary } from './store.types';

interface State {
  groups: Group[];
  currentImage: Image | undefined;
}

const state: State = {
  groups: [],
  currentImage: undefined,
};

const state$ = new BehaviorSubject<State>(state);
const destroy$ = new Subject<void>();

function selectedImages(groups: Group[]): Image[] {
  return groups
    .filter((group) => group.visible)
    .map((group) => group.images)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

export default {
  effect(observable$: Observable<any>) {
    observable$.pipe(takeUntil(destroy$)).subscribe();
  },
  get: {
    groups$: state$.pipe(
      map((state) => state.groups),
      distinct()
    ),
    images$: state$.pipe(map((state) => selectedImages(state.groups))),
    currentImage$: state$.pipe(map((state) => state.currentImage)),
  },
  set: {
    itinerary(itinerary: Itinerary) {
      const images = selectedImages(itinerary.groups);
      const currentImage = images.length > 0 ? images[0] : undefined;
      state$.next({ ...state$.value, groups: itinerary.groups, currentImage });
    },
    trackLength(groupId: string, trackId: string, length: number) {
      const group = state$.value.groups.find((group) => group.id === groupId);
      if (!group) {
        return;
      }
      const newTrack = group.tracks.find((track) => track.id === trackId);
      if (!newTrack) {
        return;
      }
      newTrack.length = length;
      const newGroup = {
        ...group,
        tracks: group.tracks.map((track) =>
          track.id === trackId ? { ...newTrack } : track
        ),
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
      const images = selectedImages(state$.value.groups);
      const index = images.findIndex(
        (image) => image.url === state$.value.currentImage?.url
      );
      let currentImage = undefined;
      if (index >= 0) {
        currentImage = images[(index + 1) % images.length];
      }
      state$.next({ ...state$.value, currentImage });
    },
    previousImage() {
      const images = selectedImages(state$.value.groups);
      const index = images.findIndex(
        (image) => image.url === state$.value.currentImage?.url
      );
      let currentImage = undefined;
      if (index >= 0) {
        currentImage = images[(index + images.length + 1) % images.length];
      }
      state$.next({ ...state$.value, currentImage });
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
