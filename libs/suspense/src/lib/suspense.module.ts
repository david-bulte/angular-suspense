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
import { SuspenseDirective } from './suspense.directive';
import { SuspensePipe } from './suspense.pipe';

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
    SuspenseDirective,
    SuspensePipe,
  ],
  exports: [
    SuspenseComponent,
    EmptyDirective,
    ErrorDirective,
    LoadingDirective,
    SuccessDirective,
    DefaultTemplatesComponent,
    SuspenseDirective,
    SuspensePipe,
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
