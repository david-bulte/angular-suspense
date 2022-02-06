import { TemplateRef } from '@angular/core';
import { EmptyDirective } from './empty.directive';
import { ErrorDirective } from './error.directive';
import { LoadingDirective } from './loading.directive';
import { SuspenseOptions } from './suspense.module';

export class SuspenseService {
  defaultErrorTemplate?: TemplateRef<ErrorDirective>;
  defaultLoadingTemplate?: TemplateRef<LoadingDirective>;
  defaultEmptyTemplate?: TemplateRef<EmptyDirective>;

  constructor(private options?: SuspenseOptions) {}

  get debugLoadingStatesInTemplate() {
    return this.options?.debugLoadingStatesInTemplate || false;
  }

  get timeout() {
    return this.options?.timeout || 0;
  }
}
