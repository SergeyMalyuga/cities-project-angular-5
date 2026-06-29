import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {favoriteOfferAdapter} from '../favorite-offer.reducer';

const selectFavoriteOfferState = createFeatureSelector<AppState['favoriteOffer']>('favoriteOffer');
const favoriteOfferSelectors = favoriteOfferAdapter.getSelectors(selectFavoriteOfferState);

export const selectFavoriteOffersTotal = favoriteOfferSelectors.selectTotal;

export const selectToggleStatus = createSelector(
  selectFavoriteOfferState,
  state => state.success
)

export const selectIsFavoriteOffersLoading = createSelector(
  selectFavoriteOfferState,
  state => state.isLoading
)

export const selectFavoriteOffers = favoriteOfferSelectors.selectAll;
