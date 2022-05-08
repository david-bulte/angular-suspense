import { Injectable } from '@angular/core';
import { LoadingStates } from '@david-bulte/angular-suspense';
import { createState, filterNil, select, Store, withProps } from '@ngneat/elf';
import {
  getEntity,
  selectActiveEntity,
  selectActiveId,
  selectAll,
  selectEntitiesCount,
  setActiveId,
  setEntities,
  updateEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createRequestsStatusOperator,
  selectRequestStatus,
  StatusState,
  updateRequestStatus,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Actor, Movie } from './movie.model';

export interface MovieProps {
  detailsLoading: boolean;
  detailsError?: Error | null;
}

const { state, config } = createState(
  withEntities<Movie, 'name'>({ idKey: 'name' }),
  withActiveId(),
  withProps<MovieProps>({ detailsLoading: false, detailsError: null }),
  withRequestsStatus<'movies'>()
);

const store = new Store({ name: 'movies', state, config });

export const trackMoviesRequestsStatus = createRequestsStatusOperator(store);

@Injectable({ providedIn: 'root' })
export class MovieRepository {
  activeMovieId$ = store.pipe(selectActiveId());

  movie$ = store.pipe(selectActiveEntity());

  movies$ = store.pipe(selectAll());

  actors$: Observable<Actor[]> = store.pipe(
    selectActiveEntity(),
    filterNil(),
    filter((movie) => movie?.actors !== undefined),
    map((movie): Actor[] => movie.actors || [])
  );

  loadingStateMovie$ = store.pipe(
    select(({ detailsLoading, detailsError }) => {
      if (detailsError) {
        return LoadingStates.ERROR;
      }
      return detailsLoading === false
        ? LoadingStates.SUCCESS
        : LoadingStates.LOADING;
    }),
    startWith(LoadingStates.LOADING)
  );

  loadingState$ = combineLatest([
    store.pipe(selectRequestStatus('movies')),
    store.pipe(selectEntitiesCount()),
  ]).pipe(
    map(([status, count]: [StatusState, number]) => {
      return status.value === 'pending'
        ? LoadingStates.LOADING
        : status.value === 'error'
        ? LoadingStates.ERROR
        : count > 0
        ? LoadingStates.SUCCESS
        : LoadingStates.EMPTY;
    }),
    startWith(LoadingStates.LOADING)
  );

  setActive(name: string | null) {
    store.update(setActiveId(name));
  }

  setMovies(movies: Movie[]) {
    store.update(setEntities(movies), updateRequestStatus('movies', 'success'));
  }

  getMovie(name: string) {
    return store.query(getEntity(name));
  }

  setLoadingDetails(props: MovieProps) {
    store.update((state) => ({
      ...state,
      ...props,
    }));
  }

  upsertMovie(name: string, movie: Movie) {
    store.update(updateEntities(name, movie), (state) => ({
      ...state,
      detailsLoading: false,
      detailsError: null,
    }));
  }
}
