import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { EmptyDirective } from '../empty.directive';
import { ErrorDirective } from '../error.directive';
import { LoadingDirective } from '../loading.directive';
import { SuspenseService } from '../suspense.service';

@Component({
  selector: 'susp-default-templates',
  templateUrl: './default-templates.component.html',
  styleUrls: ['./default-templates.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultTemplatesComponent implements AfterContentInit {
  @ContentChildren(ErrorDirective, { read: TemplateRef, descendants: false })
  errorDirective!: QueryList<TemplateRef<ErrorDirective>>;
  @ContentChildren(LoadingDirective, { read: TemplateRef, descendants: false })
  loadingDirective!: QueryList<TemplateRef<LoadingDirective>>;
  @ContentChildren(EmptyDirective, { read: TemplateRef, descendants: false })
  emptyDirective!: QueryList<TemplateRef<EmptyDirective>>;

  constructor(private suspenseService: SuspenseService) {}

  ngAfterContentInit(): void {
    this.suspenseService.defaultErrorTemplate = this.errorDirective.first;
    this.suspenseService.defaultLoadingTemplate = this.loadingDirective.first;
    this.suspenseService.defaultEmptyTemplate = this.emptyDirective.first;
  }
}
