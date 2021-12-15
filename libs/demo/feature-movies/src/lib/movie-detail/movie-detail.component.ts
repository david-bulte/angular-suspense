import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingState } from '@david-bulte/angular-suspense';
import { BehaviorSubject, distinctUntilChanged, filter, map, take } from 'rxjs';
import { Actor, MovieService } from '../movie.service';

@Component({
  selector: 'demo-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  loadingStateMovie$ = this.movieService.loadingStateMovie$;
  movie$ = this.movieService.movie$;
  actors$ = this.movieService.actors$;
  actor$$ = new BehaviorSubject<Actor | null>(null);
  loadingStateActor$$ = new BehaviorSubject(LoadingState.LOADING);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('name')),
        filter((name) => !!name),
        distinctUntilChanged()
      )
      .subscribe((name) => {
        this.movieService.setActiveMovie(name);
      });

    this.actors$.pipe(take(1)).subscribe((actors) => {
      if (actors?.length > 0) {
        this.onSelectActor(actors[0].id);
      } else {
        this.loadingStateActor$$.next(LoadingState.SUCCESS);
      }
    });
  }

  onSelectActor(id: number) {
    this.actor$$.next(null);
    this.loadingStateActor$$.next(LoadingState.LOADING);
    this.movieService.loadActor(id).subscribe(
      (actor) => {
        console.log('actor', actor);
        this.loadingStateActor$$.next(LoadingState.SUCCESS);
        this.actor$$.next(actor);
      },
      (err) => {
        this.loadingStateActor$$.next(LoadingState.ERROR);
      }
    );
  }
}
