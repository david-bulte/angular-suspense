import { LoadingState } from '@david-bulte/angular-suspense';
import { BehaviorSubject } from 'rxjs';

export interface Suspensable {
  debug?: string;
  publicLoadingState$$: BehaviorSubject<LoadingState>;
}
