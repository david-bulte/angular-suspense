import { Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSuccess]',
})
export class SuccessDirective {
  @HostBinding('style.display')
  get display() {
    return 'none';
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  show() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
  }

  hide() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }
}
