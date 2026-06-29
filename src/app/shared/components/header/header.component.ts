import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppRoute, AuthorizationStatus} from '../../../core/constants/const';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {selectAuthStatus, selectUserEmail} from '../../../store/user/selectors/user.selectors';
import {selectFavoriteOffersTotal} from '../../../store/favorite-offer/selectors/favorite-offer.selectors';
import {logout} from '../../../store/user/actions/user.actions';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private store = inject(Store<AppState>);

  protected readonly AppRoute = AppRoute;

  public authStatus = this.store.selectSignal(selectAuthStatus);
  public userEmail = this.store.selectSignal(selectUserEmail);
  public favoriteOffersTotal = this.store.selectSignal(selectFavoriteOffersTotal);

  public isAuthorized = computed(() => this.authStatus() === AuthorizationStatus.AUTH);

  public logout() {
    if (this.isAuthorized()) {
      this.store.dispatch(logout());
    }
  }
}
