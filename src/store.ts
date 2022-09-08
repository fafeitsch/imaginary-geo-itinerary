import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { Track } from './store.types';

interface State {
  tracks: Track[];
}

const state: State = {
  tracks: [],
};

const state$ = new BehaviorSubject<State>(state);
const destroy$ = new Subject<void>();

export default {
  effect(observable$: Observable<any>) {
    observable$.pipe(takeUntil(destroy$)).subscribe();
  },
  get: {
    tracks$: state$.pipe(map((state) => state.tracks)),
  },
  set: {
    tracks(tracks: Track[]) {
      state$.next({ ...state$.value, tracks });
    },
    toggleTrackVisibility(url: string) {
      state$.next({
        ...state$.value,
        tracks: state$.value.tracks.map((track) =>
          track.url === url
            ? {
                ...track,
                visible: !track.visible,
              }
            : track
        ),
      });
    },
  },
};
