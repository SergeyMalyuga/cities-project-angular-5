import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {Offer, OfferPreview} from '../../core/models/offers';
import {Comment} from '../../core/models/comments';
import {catchError, combineLatest, EMPTY, finalize, first, map, merge, of, pipe, Subject, switchMap, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferDataService} from '../../core/services/offer-data.service';
import {AppRoute, AuthorizationStatus, QUANTITY_FIRST_OFFERS} from '../../core/constants/const';
import {selectAuthStatus} from '../../store/user/selectors/user.selectors';
import {NgClass, SlicePipe, TitleCasePipe} from '@angular/common';
import {OfferService} from '../../core/services/offer.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommentService} from '../../core/services/comment.service';
import {MapComponent} from '../../shared/components/map/map.component';

@Component({
  selector: 'app-offer',
  imports: [
    HeaderComponent,
    NgClass,
    TitleCasePipe,
    MapComponent,
    SlicePipe
  ],
  templateUrl: './offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferComponent implements OnInit {
  private store = inject(Store<AppState>);
  private activatedRoute = inject(ActivatedRoute);
  private offerDataService = inject(OfferDataService);
  private offerService = inject(OfferService);
  private commentService = inject(CommentService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public offer = signal<Offer | null>(null);
  public refreshOffer$ = new Subject<void>();
  public offerId = computed(() => this.offer()?.id);

  public comments = signal<Comment[]>([]);
  public refreshComments$ = new Subject<void>();

  public nearbyOffers = signal<OfferPreview[]>([]);
  public refreshNearbyOffers$ = new Subject<void>();

  public isLoading = signal<boolean>(false);

  public authStatus = this.store.selectSignal(selectAuthStatus);

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(params => params.get('id')),
      first((id): id is string => id !== null),
      switchMap(id => {
        const offer$ = merge(
          this.offerDataService.getOfferById(id),
          this.refreshOffer$.pipe(switchMap(() => this.offerDataService.getOfferById(id)
            .pipe(catchError(() => {
                this.router.navigate([AppRoute.MAIN]);
                return EMPTY
              }),
              finalize(() => this.isLoading.set(false))))),
        );

        const nearbyOffers$ = merge(
          this.offerDataService.getNearbyOffers(id),
          this.refreshNearbyOffers$.pipe(switchMap(() => this.offerDataService.getNearbyOffers(id)
            .pipe(catchError(() => of([]))))));

        const comments$ = merge(
          this.commentService.getComments(id),
          this.refreshComments$.pipe(switchMap(() => this.commentService.getComments(id)
            .pipe(catchError(() => of([]))))));

        return combineLatest({offer: offer$, nearbyOffers: nearbyOffers$, comments: comments$})
      }), pipe(takeUntilDestroyed(this.destroyRef))).subscribe((result) => {
      this.offer.set(result.offer);
      this.nearbyOffers.set(result.nearbyOffers);
      this.comments.set(result.comments);
    })
  }

  public isAuth(): boolean {
    return this.authStatus() === AuthorizationStatus.AUTH;
  }

  public toggleFavorite() {
    const offer = this.offer();
    if (offer) {
      this.isLoading.set(true);
      this.offerService.toggleFavorite(offer.id, offer.isFavorite)
        .pipe(first(success => success !== null),
          tap(success => {
            if (success) {
              this.refreshOffer$.next();
            } else {
              this.isLoading.set(false);
            }
          }), catchError(() => {
            this.isLoading.set(false);
            return EMPTY
          }), pipe(takeUntilDestroyed(this.destroyRef))).subscribe();
    }
  }

  public refreshNearbyOffers() {
    this.refreshNearbyOffers$.next();
  }

  public get rating() {
    const offer = this.offer();
    if (offer) {
      return Math.floor(offer.rating * 20);
    }
    return 0;
  }

  protected readonly QUANTITY_FIRST_OFFERS = QUANTITY_FIRST_OFFERS;
}
