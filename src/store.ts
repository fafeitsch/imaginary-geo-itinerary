import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { Group, Itinerary } from './store.types';

interface State {
  groups: Group[];
}

const state: State = {
  groups: [],
};

const state$ = new BehaviorSubject<State>(state);
const destroy$ = new Subject<void>();

export default {
  effect(observable$: Observable<any>) {
    observable$.pipe(takeUntil(destroy$)).subscribe();
  },
  get: {
    groups$: state$.pipe(map((state) => state.groups)),
  },
  set: {
    itinerary(itinerary: Itinerary) {
      state$.next({ ...state$.value, groups: itinerary.groups });
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
    toggleGroupVisibility(id: string) {
      state$.next({
        ...state$.value,
        groups: state$.value.groups.map((group) =>
          group.id === id
            ? {
                ...group,
                visible: !group.visible,
              }
            : group
        ),
      });
    },
  },
};
