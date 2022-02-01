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
import { Actor, MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  loadingStateMovie$ = this.movieService.loadingStateMovie$;
  movie$ = this.movieService.movie$;
  actors$ = this.movieService.actors$;
  actor$$ = new BehaviorSubject<Actor | null>(null);
  loadingStateActor$$ = new BehaviorSubject(LoadingState.LOADING);

  name$!: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.name$ = this.route.paramMap.pipe(
      map((params) => params.get('name') as string),
      // filter((name) => !!name),
      distinctUntilChanged()
    );

    this.name$.subscribe((name) => {
      this.movieService.setActiveMovie(name);
      this.actor$$.next(null);
    });

    this.actors$.pipe(take(1)).subscribe((actors) => {
      // if (actors?.length > 0) {
      //   this.onSelectActor(actors[0].id);
      // } else {
      this.loadingStateActor$$.next(LoadingState.SUCCESS);
      // }
    });
  }

  onSelectActor(id: number) {
    this.actor$$.next(null);
    this.loadingStateActor$$.next(LoadingState.LOADING);
    this.movieService.loadActor(id).subscribe(
      (actor) => {
        console.log('actor', actor);
        this.loadingStateActor$$.next(
          actor?.summary ? LoadingState.SUCCESS : LoadingState.EMPTY
        );
        this.actor$$.next(actor);
      },
      (err) => {
        this.loadingStateActor$$.next(LoadingState.ERROR);
      }
    );
  }
}
