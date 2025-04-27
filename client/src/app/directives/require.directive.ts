import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[require]',
  standalone: true
})
export class RequireDirective implements OnChanges {

  @Input('require') isRequired: boolean | string | undefined;

  private span: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isRequired' in changes) {
      this.updateRequiredIndicator();
    }
  }

  private updateRequiredIndicator(): void {
    if (this.isRequired === false) {
      if (this.span) {
        this.renderer.removeChild(this.el.nativeElement, this.span);
        this.span = null;
      }
    }
    else {
      if (!this.span) {
        this.span = this.renderer.createElement('span');
        this.renderer.setStyle(this.span, 'color', 'red');
        if (this.span) {
          this.span.textContent = '*';
        }
        this.renderer.appendChild(this.el.nativeElement, this.span);
      }
    }
  }
}
