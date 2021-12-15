import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  filterNilValue,
  QueryEntity,
  StoreConfig,
} from '@datorama/akita';
import { LoadingState } from '@david-bulte/angular-suspense';
import { filter, map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Actor, Movie } from './movie.service';

@Injectable({ providedIn: 'root' })
export class MovieRepo {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movie', idKey: 'name' })
export class MovieStore extends EntityStore<MovieState> {
  constructor() {
    super();
  }
}

@Injectable({ providedIn: 'root' })
export class MovieQuery extends QueryEntity<MovieState> {
  movie$ = this.selectActive();

  actors$: Observable<Actor[]> = this.selectActive().pipe(
    filterNilValue(),
    filter((movie) => movie?.actors !== undefined),
    map((movie): Actor[] => movie.actors || [])
  );

  loadingStateMovie$ = this.select().pipe(
    map(({ detailsLoading, detailsError }) => {
      if (detailsError) {
        return LoadingState.ERROR;
      }
      return detailsLoading === false
        ? LoadingState.SUCCESS
        : LoadingState.LOADING;
    }),
    startWith(LoadingState.LOADING)
  );

  constructor(store: MovieStore) {
    super(store);
  }
}

interface MovieState extends EntityState<Movie>, ActiveState {
  detailsLoading: boolean;
  detailsError?: Error | null;
}

// interface MoviesUIState extends EntityState<MovieUI>, ActiveState {}
