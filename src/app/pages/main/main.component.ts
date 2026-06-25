import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {selectCity, selectOffersByCity} from '../../store/app/selectors/app.selectors';
import {OfferCardComponent} from '../../shared/components/offer-card/offer-card.component';
import {NgClass} from '@angular/common';
import {CITY_LOCATIONS} from '../../core/constants/const';
import {City} from '../../core/models/city';
import {changeCity} from '../../store/city/actions/city.actions';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    OfferCardComponent,
    NgClass,
  ],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  private store = inject(Store<AppState>);

  protected readonly CITY_LOCATIONS = CITY_LOCATIONS;

  public offers = this.store.selectSignal(selectOffersByCity);
  public currentCity = this.store.selectSignal(selectCity);

  public changeCity(city: City): void {
    this.store.dispatch(changeCity({city}));
  }
}
