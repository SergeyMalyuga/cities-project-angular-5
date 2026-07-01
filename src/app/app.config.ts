import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideEffects} from '@ngrx/effects';
import {OfferEffects} from './store/offer/effects/offer.effects';
import {provideStore} from '@ngrx/store';
import {appReducer} from './store/app/app.reducer';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi,} from '@angular/common/http';
import {UserEffects} from './store/user/effects/user.effects';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {FavoriteOfferEffects} from './store/favorite-offer/effects/favorite-offer.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEffects(OfferEffects, UserEffects, FavoriteOfferEffects),
    provideStore(appReducer),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
