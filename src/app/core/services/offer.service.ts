import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../models/app.state';
import {selectAuthStatus} from '../../store/user/selectors/user.selectors';
import {Router} from '@angular/router';
import {AppRoute, AuthorizationStatus} from '../constants/const';
import {toggleFavorite} from '../../store/favorite-offer/actions/favorite-offer.actions';
import {selectToggleStatus} from '../../store/favorite-offer/selectors/favorite-offer.selectors';
import {EMPTY, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private store = inject(Store<AppState>);
  private authStatus = this.store.selectSignal(selectAuthStatus);
  private router = inject(Router);

  public toggleFavorite(
    offerId: string,
    isFavorite: boolean,
  ): Observable<boolean | null> {
    if (this.authStatus() === AuthorizationStatus.AUTH) {
      this.store.dispatch(toggleFavorite({ offerId, isFavorite: !isFavorite }));
      return this.store.select(selectToggleStatus);
    } else {
      this.router.navigate([AppRoute.LOGIN]);
      return EMPTY;
    }
  }
}
