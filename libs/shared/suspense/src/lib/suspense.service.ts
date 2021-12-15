import { Injectable, TemplateRef } from '@angular/core';
import { ErrorDirective } from './error.directive';
import { LoadingDirective } from './loading.directive';
import { EmptyDirective } from './empty.directive';

@Injectable({
  providedIn: 'root',
})
export class SuspenseService {
  defaultErrorTemplate?: TemplateRef<ErrorDirective>;
  defaultLoadingTemplate?: TemplateRef<LoadingDirective>;
  defaultEmptyTemplate?: TemplateRef<EmptyDirective>;
}
