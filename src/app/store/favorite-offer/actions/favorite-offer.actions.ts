import { createAction, props } from '@ngrx/store';
import { Offer, OfferPreview } from '../../../core/models/offers';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFavoriteOffers = createAction(
  '[Favorite Offer] Load Favorite Offers',
);
export const loadFavoriteOffersSuccess = createAction(
  '[Favorite Offer Effects] Load Favorite Offers Success',
  props<{ offers: OfferPreview[] }>(),
);
export const loadFavoriteOffersFailure = createAction(
  '[Favorite Offer Effects] Load Favorite Offers Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const toggleFavorite = createAction(
  '[Favorite Offer] Toggle Favorite Offer',
  props<{ offerId: string; isFavorite: boolean }>(),
);
export const toggleFavoriteSuccess = createAction(
  '[Favorite Offer Effects] Toggle Favorite Offer Success',
  props<{ offer: Offer }>(),
);
export const toggleFavoriteFailure = createAction(
  '[Favorite Offer Effects] Toggle Favorite Offer Failure',
  props<{ error: HttpErrorResponse }>(),
);
