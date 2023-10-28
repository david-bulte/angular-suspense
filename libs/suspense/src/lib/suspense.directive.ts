import { Directive, Input, Optional, SkipSelf } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Suspensable } from './suspensable';
import { SuspenseService } from './suspense.service';
import {
  LoadingStates,
  SuspenseComponent,
} from './suspense/suspense.component';

@Directive({
  selector: '[susp]',
})
export class SuspenseDirective implements Suspensable {
  @Input() debug?: string;
  @Input() debounce!: number;
  public publicLoadingState$$ = new BehaviorSubject(LoadingStates.LOADING);

  constructor(
    private routerOutlet: RouterOutlet,
    private suspenseService: SuspenseService,
    @Optional() @SkipSelf() private parent?: SuspenseComponent
  ) {
    console.log('??? 1', parent?.publicLoadingState$$.getValue());
    parent?.registerChild(this);
    console.log('??? 2', parent?.publicLoadingState$$.getValue());
    this.debounce ??= this.suspenseService.debounce;

    this.routerOutlet.activateEvents.subscribe((e) => {
        // this.publicLoadingState$$.next(LoadingStates.SUCCESS);
      // console.log('>>>', e);
    });
    // this.routerOutlet.deactivateEvents.subscribe((e) => {
    //   console.log('>>>', e);
    // });
    // setTimeout(() => {
    //   console.log('now');
    //   this.publicLoadingState$$.next(LoadingStates.SUCCESS);
    // }, 10000);
  }
}
