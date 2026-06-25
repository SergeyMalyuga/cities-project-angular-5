import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ToggleDirective} from '../../shared/directives/toggle.directive';
import {NgClass} from '@angular/common';
import {HoverTrackerDirective} from '../../shared/directives/hover-tracker.directive';

@Component({
  selector: 'app-places-sorting-form',
  imports: [
    ToggleDirective,
    NgClass,
    HoverTrackerDirective
  ],
  templateUrl: './places-sorting-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacesSortingFormComponent {
  public isOpen = signal<boolean>(false);

  public toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  public closeMenu() {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  public onHovered(isHover: boolean) {
    if (!isHover) {
      this.closeMenu();
    }
  }
}
