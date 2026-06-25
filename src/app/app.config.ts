import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideEffects} from '@ngrx/effects';
import {OfferEffects} from './store/offer/effects/offer.effects';
import {provideStore} from '@ngrx/store';
import {appReducer} from './store/app/app.reducer';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideEffects(OfferEffects),
    provideStore(appReducer),
    provideHttpClient(withInterceptorsFromDi())
  ]
};
