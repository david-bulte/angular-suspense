import { Component } from '@angular/core';
import { LoadingStates } from '@david-bulte/angular-suspense';
import { BehaviorSubject, delay, of, tap } from 'rxjs';

@Component({
  selector: 'angular-suspense-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent {
  loadingState$$ = new BehaviorSubject(LoadingStates.LOADING);
  stats$ = of(42).pipe(
    tap(() => console.log('start loading stats')),
    delay(10000),
    tap(() => {
      console.log('now');
      this.loadingState$$.next(LoadingStates.SUCCESS);
    })
  );
}
