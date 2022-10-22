import { Input, Optional, Pipe, PipeTransform, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Suspensable } from './suspensable';
import { SuspenseService } from './suspense.service';
import {
  LoadingStates,
  SuspenseComponent,
} from './suspense/suspense.component';

@Pipe({
  name: 'suspense',
})
export class SuspensePipe implements PipeTransform, Suspensable {
  @Input() debug?: string;
  @Input() debounce!: number;
  public publicLoadingState$$ = new BehaviorSubject(LoadingStates.LOADING);

  constructor(
    private suspenseService: SuspenseService,
    @Optional() @SkipSelf() private parent?: SuspenseComponent
  ) {
    console.log('++++++++++++++ 1');
    parent?.registerChild(this);
    this.debounce ??= this.suspenseService.debounce;
    // setTimeout(() => {
    //   console.log('now');
    //   this.publicLoadingState$$.next(LoadingStates.SUCCESS);
    // }, 10000);
  }

  transform(value: any, ...args: unknown[]): any {
    console.log('++++++++++++++ 2', value);
    // if (value) {
    setTimeout(() => {
      this.publicLoadingState$$.next(LoadingStates.SUCCESS);
    });
    // }
    return value;
  }
}
