import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Offer, OfferPreview} from '../models/offers';
import {API_PATHS, APIRoute, BASE_URL} from '../constants/const';
import {defaultHttpOperators} from '../utils/rjxs-operators';

@Injectable({
  providedIn: 'root',
})
export class OfferDataService {
  private http = inject(HttpClient);

  public getOffers(): Observable<OfferPreview[]> {
    return this.http
      .get<OfferPreview[]>(`${BASE_URL}/${APIRoute.OFFERS}`)
      .pipe(...defaultHttpOperators<OfferPreview[]>());
  }

  public getOfferById(offerId: string): Observable<Offer> {
    return this.http
      .get<Offer>(`${BASE_URL}/${APIRoute.OFFERS}/${offerId}`)
      .pipe(...defaultHttpOperators<Offer>());
  }

  public getNearbyOffers(offerId: string): Observable<OfferPreview[]> {
    return this.http
      .get<
        OfferPreview[]
      >(`${BASE_URL}/${APIRoute.OFFERS}/${offerId}/${API_PATHS.NEARBY}`)
      .pipe(...defaultHttpOperators<OfferPreview[]>());
  }
}
