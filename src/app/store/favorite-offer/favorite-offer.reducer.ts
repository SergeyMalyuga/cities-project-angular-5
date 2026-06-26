import {createEntityAdapter} from '@ngrx/entity';
import {OfferPreview} from '../../core/models/offers';
import {FavoriteOfferState} from '../../core/models/favorite-offer.state';
import {createReducer} from '@ngrx/store';

export const favoriteOfferAdapter = createEntityAdapter<OfferPreview>();
const initialStata: FavoriteOfferState = favoriteOfferAdapter.getInitialState({
  isLoading: false,
  error: null,
  success: null
});

export const favoriteOfferReducer = createReducer(initialStata);
