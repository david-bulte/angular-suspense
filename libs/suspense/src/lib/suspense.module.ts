import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DefaultTemplatesComponent } from './default-templates/default-templates.component';
import { EmptyDirective } from './empty.directive';
import { ErrorDirective } from './error.directive';
import { LoadingDirective } from './loading.directive';
import { SuccessDirective } from './success.directive';
import { SuspenseService } from './suspense.service';
import { SuspenseComponent } from './suspense/suspense.component';
import { TargetDirective } from './target.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SuspenseComponent,
    EmptyDirective,
    ErrorDirective,
    LoadingDirective,
    SuccessDirective,
    TargetDirective,
    DefaultTemplatesComponent,
  ],
  exports: [
    SuspenseComponent,
    EmptyDirective,
    ErrorDirective,
    LoadingDirective,
    SuccessDirective,
    DefaultTemplatesComponent,
  ],
})
export class SuspenseModule {
  static forRoot(
    config?: SuspenseOptions
  ): ModuleWithProviders<SuspenseModule> {
    const suspenseService = new SuspenseService(config);
    return {
      ngModule: SuspenseModule,
      providers: [{ provide: SuspenseService, useValue: suspenseService }],
    };
  }
}

export interface SuspenseOptions {
  debounce?: number;
  debugLoadingStatesInTemplate?: boolean;
}
