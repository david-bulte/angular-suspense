import { Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';

@Directive({
  selector: '[suspSuccess]',
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
    console.log(
      'this.elementRef.nativeElement.style.display',
      this.elementRef.nativeElement.style.display
    );
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }
}
