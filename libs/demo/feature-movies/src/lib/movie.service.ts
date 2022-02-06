import { Injectable } from '@angular/core';
import { EMPTY, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MovieApi } from './movie.api';
import { MovieRepository, trackMoviesRequestsStatus } from './movie.repository';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  genres$ = this.movieApi.listGenres();

  constructor(private movieApi: MovieApi, private movieRepo: MovieRepository) {}

  setActiveMovie(name: string | null): void {
    this.movieRepo.setActive(name);
    if (name) {
      this.loadMovie(name).subscribe();
    }
  }

  loadAll(genre: string | null) {
    return this.movieApi.listMovies(genre).pipe(
      tap((movies) => this.movieRepo.setMovies(movies)),
      trackMoviesRequestsStatus('movies')
    );
  }

  loadMovie(name: string) {
    // if is loaded
    if (this.movieRepo.getMovie(name)?.actors !== undefined) {
      this.movieRepo.setLoadingDetails({
        detailsLoading: false,
        detailsError: null,
      });
      return EMPTY;
    }

    this.movieRepo.setLoadingDetails({
      detailsLoading: true,
      detailsError: null,
    });

    return this.movieApi.getMovie(name).pipe(
      tap((movie) => {
        this.movieRepo.upsertMovie(name, movie);
      }),
      catchError((err) => {
        this.movieRepo.setLoadingDetails({
          detailsLoading: false,
          detailsError: err,
        });
        return throwError(err);
      })
    );
  }

  loadActor(id: number) {
    return this.movieApi.getActor(id);
  }
}
