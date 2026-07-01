import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appHoverTracker]',
})
export class HoverTrackerDirective {
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('mouseenter')
  onMouseEnter() {
    this.hovered.emit(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hovered.emit(false);
  }
}
