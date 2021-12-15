import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { LoadingState } from '@david-bulte/angular-suspense';
import { combineLatest, EMPTY, throwError } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { MovieApi } from './movie.api';
import { MovieQuery, MovieStore } from './movie.repo';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movies$ = this.movieQuery.selectAll();
  genres$ = this.movieApi.listGenres();

  loadingState$ = combineLatest([
    this.movieQuery.selectLoading(),
    this.movieQuery.selectError(),
    this.movieQuery.selectCount(),
  ]).pipe(
    map(([loading, error, count]) => {
      return loading
        ? LoadingState.LOADING
        : error
        ? LoadingState.ERROR
        : count > 0
        ? LoadingState.SUCCESS
        : LoadingState.EMPTY;
    }),
    startWith(LoadingState.LOADING)
  );

  actors$ = this.movieQuery.actors$;
  movie$ = this.movieQuery.movie$;
  loadingStateMovie$ = this.movieQuery.loadingStateMovie$;

  constructor(
    private movieApi: MovieApi,
    private movieStore: MovieStore,
    private movieQuery: MovieQuery
  ) {}

  setActiveMovie(name: string | null): void {
    this.movieStore.setActive(name);
    if (name) {
      this.loadMovie(name).subscribe();
    }
  }

  loadAll(genre: string | null) {
    this.movieStore.setLoading(true);
    return this.movieApi.listMovies(genre).pipe(
      tap((movies) => {
        applyTransaction(() => {
          // this.movieStore.upsertMany(movies);
          this.movieStore.set(movies);
          this.movieStore.setLoading(false);
        });
      }),
      catchError((err) => {
        this.movieStore.setError(err);
        return throwError(err);
      })
    );
  }

  loadMovie(name: string) {
    // if is loaded
    if (this.getMovie(name)?.actors !== undefined) {
      return EMPTY;
    }

    this.movieStore.update({
      detailsLoading: true,
      detailsError: null,
    });

    return this.movieApi.getMovie(name).pipe(
      tap((movie) => {
        applyTransaction(() => {
          this.movieStore.upsert(name, movie);
          this.movieStore.update({ detailsLoading: false });
        });
      }),
      catchError((err) => {
        this.movieStore.update({ detailsLoading: false, detailsError: err });
        return throwError(err);
      })
    );
  }

  getMovie(name: string) {
    return this.movieQuery.getEntity(name);
  }

  loadActor(id: number) {
    return this.movieApi.getActor(id);
  }
}

export interface Movie {
  name: string;
  director: string;
  genre: string;
  synopsis: string;
  year: number;
  actors?: Actor[];
}

export interface Actor {
  id: number;
  givenName: string;
  lastName: string;
}
