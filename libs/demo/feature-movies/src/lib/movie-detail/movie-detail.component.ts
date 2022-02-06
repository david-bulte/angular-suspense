import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingState } from '@david-bulte/angular-suspense';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  take,
} from 'rxjs';
import { Actor } from '../movie.model';
import { MovieRepository } from '../movie.repository';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  movie$ = this.movieRepo.movie$;
  actors$ = this.movieRepo.actors$;
  loadingStateMovie$ = this.movieRepo.loadingStateMovie$;
  actor$$ = new BehaviorSubject<Actor | null>(null);
  loadingStateActor$$ = new BehaviorSubject(LoadingState.LOADING);

  name$!: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private movieRepo: MovieRepository,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.name$ = this.route.paramMap.pipe(
      map((params) => params.get('name') as string),
      distinctUntilChanged()
    );

    this.name$.subscribe((name) => {
      this.movieService.setActiveMovie(name);
      this.actor$$.next(null);
    });

    this.actors$.pipe(take(1)).subscribe(() => {
      this.loadingStateActor$$.next(LoadingState.SUCCESS);
    });
  }

  onSelectActor(id: number) {
    this.actor$$.next(null);
    this.loadingStateActor$$.next(LoadingState.LOADING);
    this.movieService.loadActor(id).subscribe(
      (actor) => {
        this.loadingStateActor$$.next(
          actor?.summary ? LoadingState.SUCCESS : LoadingState.EMPTY
        );
        this.actor$$.next(actor);
      },
      () => {
        this.loadingStateActor$$.next(LoadingState.ERROR);
      }
    );
  }
}
