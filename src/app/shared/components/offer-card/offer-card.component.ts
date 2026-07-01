import {ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, Output,} from '@angular/core';
import {OfferPreview} from '../../../core/models/offers';
import {NgClass, TitleCasePipe} from '@angular/common';
import {HoverTrackerDirective} from '../../directives/hover-tracker.directive';
import {OfferService} from '../../../core/services/offer.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {selectIsFavoriteOffersLoading} from '../../../store/favorite-offer/selectors/favorite-offer.selectors';
import {RouterLink} from '@angular/router';
import {AppRoute} from '../../../core/constants/const';
import {first, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-offer-card',
  imports: [TitleCasePipe, HoverTrackerDirective, NgClass, RouterLink],
  templateUrl: './offer-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCardComponent {
  @Input({ required: true }) offer!: OfferPreview;
  @Input() isFavoritesPage = false;
  @Input() isDisabled: boolean | null = null;
  @Output() hovered = new EventEmitter<OfferPreview | null>();
  @Output() toggled = new EventEmitter<void>();

  private offerService = inject(OfferService);
  private store = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef);

  public isLoading = this.store.selectSignal(selectIsFavoriteOffersLoading);

  protected readonly Math = Math;
  protected readonly AppRoute = AppRoute;

  public onHovered(isHover: boolean) {
    if (isHover) {
      this.hovered.emit(this.offer);
    } else {
      this.hovered.emit(null);
    }
  }

  public toggleFavorite() {
    this.offerService
      .toggleFavorite(this.offer.id, this.offer.isFavorite)
      .pipe(
        first((success) => success !== null),
        tap((success) => {
          if (success) {
            this.toggled.emit();
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
