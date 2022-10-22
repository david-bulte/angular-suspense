import { Component, Input, OnInit } from '@angular/core';
import { LoadingStates } from '@david-bulte/angular-suspense';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'foo',
  template: `<susp [state]="loadingState$$ | async">foo - {{ sleep }}</susp>`,
})
export class FooComponent implements OnInit {
  @Input() sleep = 0;

  loadingState$$ = new BehaviorSubject(LoadingStates.LOADING);

  ngOnInit() {
    timer(this.sleep).subscribe(() =>
      this.loadingState$$.next(LoadingStates.SUCCESS)
    );
  }
}
