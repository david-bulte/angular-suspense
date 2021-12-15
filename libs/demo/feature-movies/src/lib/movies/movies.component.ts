import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'demo-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  genres$ = this.movieService.genres$;
  displayedColumns = ['name', 'director'];

  loadingState$ = this.movieService.loadingState$;
  movies$ = this.movieService.movies$;

  genre$$ = new BehaviorSubject<string | null>(null);

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.genre$$
      .pipe(switchMap((genre) => this.movieService.loadAll(genre)))
      .subscribe();
  }

  onSelectGenre(genre: any) {
    this.genre$$.next(genre);
  }
}
