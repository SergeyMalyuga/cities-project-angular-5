import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {OfferPreview} from '../../../core/models/offers';
import {NgClass, TitleCasePipe} from '@angular/common';
import {HoverTrackerDirective} from '../../directives/hover-tracker.directive';
import {OfferService} from '../../../core/services/offer.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {selectIsFavoriteOffersLoading} from '../../../store/favorite-offer/selectors/favorite-offer.selectors';

@Component({
  selector: 'app-offer-card',
  imports: [
    TitleCasePipe,
    HoverTrackerDirective,
    NgClass
  ],
  templateUrl: './offer-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCardComponent {
  @Input({required: true}) offer!: OfferPreview;
  @Output() hovered = new EventEmitter<OfferPreview | null>();

  private offerService = inject(OfferService);
  private store = inject(Store<AppState>);
  public isLoading = this.store.selectSignal(selectIsFavoriteOffersLoading);

  protected readonly Math = Math;

  public onHovered(isHover: boolean) {
    if (isHover) {
      this.hovered.emit(this.offer);
    } else {
      this.hovered.emit(null);
    }
  }

  public toggleFavorite() {
    this.offerService.toggleFavorite(this.offer.id, this.offer.isFavorite);
  }
}
