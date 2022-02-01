import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit {
  genres$ = this.movieService.genres$;
  displayedColumns = ['name', 'director'];

  loadingState$ = this.movieService.loadingState$;
  movies$ = this.movieService.movies$;
  activeMovieId$ = this.movieService.activeMovieId$;

  genre$$ = new BehaviorSubject<string | null>(null);

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.genre$$
      .pipe(switchMap((genre) => this.movieService.loadAll(genre)))
      .subscribe();
  }

  showDetails(movieId: string) {
    this.router.navigate([movieId], { relativeTo: this.route });
  }

  onSelectGenre(genre: any) {
    this.genre$$.next(genre);
  }
}
