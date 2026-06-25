import { OfferState } from './offer-state';
import { UserState } from './user.state';
import { FavoriteOfferState } from './favorite-offer.state';
import { City } from './city';

export interface AppState {
  offer: OfferState;
  favoriteOffer: FavoriteOfferState;
  currentCity: City;
  user: UserState;
}
