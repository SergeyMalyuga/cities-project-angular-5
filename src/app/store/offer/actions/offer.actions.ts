import {createAction, props} from '@ngrx/store';
import {OfferPreview} from '../../../core/models/offers';
import {HttpErrorResponse} from '@angular/common/http';

export const loadOffers = createAction('[Offer] Load offers');
export const loadOffersSuccess = createAction(
  '[Offer] Load offers Success',
  props<{ offers: OfferPreview[] }>(),
);
export const loadOffersFailure = createAction(
  '[Offer] Load offers Failure',
  props<{ error: HttpErrorResponse }>(),
);
