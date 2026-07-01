import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../core/models/app.state';
import {Offer, OfferPreview} from '../../core/models/offers';
import {Comment} from '../../core/models/comments';
import {catchError, combineLatest, EMPTY, filter, finalize, map, merge, of, pipe, Subject, switchMap, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferDataService} from '../../core/services/offer-data.service';
import {AppRoute, AuthorizationStatus, QUANTITY_FIRST_OFFERS} from '../../core/constants/const';
import {selectAuthStatus} from '../../store/user/selectors/user.selectors';
import {DatePipe, NgClass, SlicePipe, TitleCasePipe} from '@angular/common';
import {OfferService} from '../../core/services/offer.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommentService} from '../../core/services/comment.service';
import {MapComponent} from '../../shared/components/map/map.component';
import {OfferCardComponent} from '../../shared/components/offer-card/offer-card.component';
import {ScrollUpDirective} from '../../shared/directives/scroll-up.directive';
import {CommentFormComponent} from '../../components/comment-form/comment-form.component';
import {SortByDatePipe} from '../../shared/pipes/sort-by-date.pipe';
import {LoaderComponent} from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-offer',
  imports: [
    HeaderComponent,
    NgClass,
    TitleCasePipe,
    MapComponent,
    SlicePipe,
    OfferCardComponent,
    ScrollUpDirective,
    CommentFormComponent,
    DatePipe,
    SortByDatePipe,
    LoaderComponent
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

  protected readonly QUANTITY_FIRST_OFFERS = QUANTITY_FIRST_OFFERS;

  public offer = signal<Offer | null>(null);
  public refreshOffer$ = new Subject<void>();
  public offerId = computed(() => this.offer()?.id ?? null);

  public comments = signal<Comment[]>([]);
  public refreshComments$ = new Subject<void>();

  public nearbyOffers = signal<OfferPreview[]>([]);
  public refreshNearbyOffers$ = new Subject<void>();
  public isNearbyOffersLoading = signal<boolean>(false);

  public isLoading = signal<boolean>(false);

  public authStatus = this.store.selectSignal(selectAuthStatus);

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(params => params.get('id')),
      filter((id): id is string => id !== null),
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
            .pipe(catchError(() => of([])), finalize(() => this.isNearbyOffersLoading.set(false))))));

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
        .pipe(filter(success => success !== null),
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
    this.isNearbyOffersLoading.set(true);
    this.refreshNearbyOffers$.next();
  }

  public refreshComments() {
    this.refreshComments$.next();
  }

  public rating = computed(() => {
    const offer = this.offer();
    return offer ? Math.floor(offer.rating * 20) : 0;
  });
  public getCommentRating(comment: Comment) {
      return comment ? Math.floor(comment.rating * 20) : 0;
  }
}
