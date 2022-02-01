import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[suspTarget]',
})
export class TargetDirective {
  constructor(public vcr: ViewContainerRef) {}
}
