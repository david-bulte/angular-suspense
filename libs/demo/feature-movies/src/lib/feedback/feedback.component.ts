import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { distinctUntilChanged, repeat, Subject, takeUntil, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  @Input() expected = 2;

  private reset$$ = new Subject<void>();
  seconds$ = timer(0, 1000).pipe(takeUntil(this.reset$$), repeat());
  warning$ = this.seconds$.pipe(
    map((seconds) => seconds > this.expected),
    distinctUntilChanged()
  );

  reset() {
    this.reset$$.next();
  }
}
