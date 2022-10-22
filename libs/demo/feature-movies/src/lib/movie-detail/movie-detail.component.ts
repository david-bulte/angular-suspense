import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingState, LoadingStates } from '@david-bulte/angular-suspense';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  take,
} from 'rxjs';
import { delay } from 'rxjs/operators';
import { FeedbackComponent } from '../feedback/feedback.component';
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
  loadingStateActor$$ = new BehaviorSubject<LoadingState | null>(
    LoadingStates.LOADING
  );
  @ViewChild('feedbackComponent') feedbackComponent?: FeedbackComponent;

  name$!: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private movieRepo: MovieRepository,
    private movieService: MovieService,
    private router: Router
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

    this.actors$.pipe(take(1), delay(5000)).subscribe(() => {
      this.loadingStateActor$$.next(LoadingStates.SUCCESS);
    });
  }

  onSelectActor(id: number) {
    this.actor$$.next(null);
    this.feedbackComponent?.reset();
    this.loadingStateActor$$.next(null);
    this.loadingStateActor$$.next(LoadingStates.LOADING);
    this.movieService.loadActor(id).subscribe(
      (actor) => {
        this.loadingStateActor$$.next(
          actor?.summary ? LoadingStates.SUCCESS : LoadingStates.EMPTY
        );
        this.actor$$.next(actor);
      },
      () => {
        this.loadingStateActor$$.next(LoadingStates.ERROR);
      }
    );
  }

  loadStats() {
    this.router.navigate(['stats'], { relativeTo: this.route });
  }
}
