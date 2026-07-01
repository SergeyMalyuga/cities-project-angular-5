import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from './core/models/app.state';
import {loadOffers} from './store/offer/actions/offer.actions';
import {checkAuth} from './store/user/actions/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);

  public ngOnInit(): void {
    this.store.dispatch(loadOffers());
    this.store.dispatch(checkAuth());
  }
}
