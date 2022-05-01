## Cookbook

### Waiting for NgIf evaluation

```angular2html
<susp [state]="loadingState$ | async" [waitFor]="1">
  <div *ngIf="movie$ | async as movie; else noMovie">
    <susp [state]="loadingState$ | async"> 
      ...
    </susp>
  </div>
  <ng-template #noMovie>
    <susp [state]="'success'"></susp>
  </ng-template>
</susp>
```

### Showing intermediary 'still waiting' messages

```typescript
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
}
```
```angular2html
<div>
  <span *ngIf="warning$ | async; else defaultLoading">this is taking longer than expected!</span>
  <span>loading...</span>
</div>
```

```angular2html
<ng-template suspLoading>
  <app-feedback #feedbackComponent [expected]="1"></app-feedback>
</ng-template>
```
### Styling SuspenseComponent depending on its loading state

Depending on its loading state, the SuspenseComponent has the following 
css classes:
- \__suspense__state-loading__
- \__suspense__state-error__
- \__suspense__state-empty__
- \__suspense__state-success__

