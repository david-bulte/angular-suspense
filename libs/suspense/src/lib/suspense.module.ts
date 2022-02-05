import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyDirective } from './empty.directive';
import { ErrorDirective } from './error.directive';
import { LoadingDirective } from './loading.directive';
import { SuccessDirective } from './success.directive';
import { SuspenseComponent } from './suspense/suspense.component';
import { TargetDirective } from './target.directive';
import { DefaultTemplatesComponent } from './default-templates/default-templates.component';

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
export class SuspenseModule {}
