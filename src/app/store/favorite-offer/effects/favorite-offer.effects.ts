import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoriteOfferService } from '../../../core/services/favorite-offer.service';
import * as FavoriteOfferActions from '../actions/favorite-offer.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteOfferEffects {
  private actions$ = inject(Actions);
  private favoriteOfferService = inject(FavoriteOfferService);

  public loadFavoriteOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteOfferActions.loadFavoriteOffers),
      switchMap(() =>
        this.favoriteOfferService.getOffers().pipe(
          map((offers) =>
            FavoriteOfferActions.loadFavoriteOffersSuccess({ offers }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(FavoriteOfferActions.loadFavoriteOffersFailure({ error })),
          ),
        ),
      ),
    ),
  );

  public toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteOfferActions.toggleFavorite),
      switchMap(({ offerId, isFavorite }) =>
        this.favoriteOfferService.toggleFavorite(offerId, isFavorite).pipe(
          map((offer) => FavoriteOfferActions.toggleFavoriteSuccess({ offer })),
          catchError((error: HttpErrorResponse) =>
            of(FavoriteOfferActions.toggleFavoriteFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
