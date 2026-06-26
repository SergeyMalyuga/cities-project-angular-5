import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {ToggleDirective} from '../../shared/directives/toggle.directive';
import {NgClass} from '@angular/common';
import {HoverTrackerDirective} from '../../shared/directives/hover-tracker.directive';
import {SortType} from '../../core/constants/const';
import {AccessibilityClickDirective} from '../../shared/directives/accessibility-click.directive';

@Component({
  selector: 'app-places-sorting-form',
  imports: [
    ToggleDirective,
    NgClass,
    HoverTrackerDirective,
    AccessibilityClickDirective
  ],
  templateUrl: './places-sorting-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacesSortingFormComponent {
  @Output() clicked = new EventEmitter<SortType>();
  @Input({required: true}) currentSortType!: SortType;

  protected readonly Object = Object;
  protected readonly SortType = SortType;

  public isOpen = signal<boolean>(false);
  public sortTypes = Object.values(SortType);

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

  public onClicked(sortType: SortType): void {
    this.clicked.emit(sortType);
    this.closeMenu();
  }
}
