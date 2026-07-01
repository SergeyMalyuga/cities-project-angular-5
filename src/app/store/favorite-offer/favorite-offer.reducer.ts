import { createEntityAdapter } from '@ngrx/entity';
import { OfferPreview } from '../../core/models/offers';
import { FavoriteOfferState } from '../../core/models/favorite-offer.state';
import { createReducer, on } from '@ngrx/store';
import {
  loadFavoriteOffers,
  loadFavoriteOffersFailure,
  loadFavoriteOffersSuccess,
  toggleFavorite,
  toggleFavoriteFailure,
  toggleFavoriteSuccess,
} from './actions/favorite-offer.actions';

export const favoriteOfferAdapter = createEntityAdapter<OfferPreview>();
const initialStata: FavoriteOfferState = favoriteOfferAdapter.getInitialState({
  isLoading: false,
  error: null,
  success: null,
});

export const favoriteOfferReducer = createReducer(
  initialStata,
  on(loadFavoriteOffers, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(loadFavoriteOffersSuccess, (state, { offers }) =>
    favoriteOfferAdapter.setAll(offers, {
      ...state,
      isLoading: false,
      error: null,
    }),
  ),
  on(loadFavoriteOffersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(toggleFavorite, (state) => ({
    ...state,
    isLoading: true,
    success: null,
  })),
  on(toggleFavoriteSuccess, (state, { offer }) => {
    if (offer.isFavorite) {
      return favoriteOfferAdapter.setOne(offer, {
        ...state,
        isLoading: false,
        success: true,
        error: null,
      });
    }
    return favoriteOfferAdapter.removeOne(offer.id, {
      ...state,
      isLoading: false,
      error: null,
      success: true,
    });
  }),
  on(toggleFavoriteFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    success: false,
  })),
);
