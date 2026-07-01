import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/models/app.state';
import {
  selectFavoriteOffers,
  selectFavoriteOffersTotal,
} from '../../store/favorite-offer/selectors/favorite-offer.selectors';
import { SortedFavoriteOffers } from '../../core/models/sorted-favorite-offers';
import { OfferCardComponent } from '../../shared/components/offer-card/offer-card.component';
import {RouterLink} from '@angular/router';
import {AppRoute} from '../../core/constants/const';

@Component({
  selector: 'app-favorites',
  imports: [HeaderComponent, OfferCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store<AppState>);

  public offers = signal<SortedFavoriteOffers>(this.getSortedOffers());
  public offersTotal = this.store.selectSignal(selectFavoriteOffersTotal);

  public ngOnInit(): void {
    this.store.select(selectFavoriteOffers).subscribe((offers) => {
      const sortedOffers = this.getSortedOffers();
      offers.forEach((offer) => {
        const key = offer.city.name.toLowerCase();
        if (this.isKetOfSortedOffers(key)) {
          sortedOffers[key].push(offer);
        }
      });
      this.offers.set(sortedOffers);
    });
  }

  public getSortedOffers(): SortedFavoriteOffers {
    return {
      paris: [],
      cologne: [],
      brussels: [],
      amsterdam: [],
      hamburg: [],
      dusseldorf: [],
    };
  }

  public cities = Object.keys(this.offers());

  public isKetOfSortedOffers(key: string): key is keyof SortedFavoriteOffers {
    return key in this.offers();
  }

  protected readonly AppRoute = AppRoute;
}
