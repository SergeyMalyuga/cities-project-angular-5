import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import {OfferPreview} from '../../../core/models/offers';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/models/app.state';
import {selectCity} from '../../../store/app/selectors/app.selectors';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input({ required: true }) offers!: OfferPreview[];
  @Input({ required: true }) activeCard!: OfferPreview | null;

  private store = inject(Store<AppState>);
  private map!: L.Map;
  private center!: L.LatLngExpression;
  private markers: L.Marker[] = [];
  private currentCity = this.store.selectSignal(selectCity);

  private defaultCustomIcon = new L.Icon({
    iconUrl: '/img/pin.svg',
    iconSize: [27, 39],
    iconAnchor: [13.5, 39],
  });

  private currentCustomIcon = new L.Icon({
    iconUrl: '/img/pin-active.svg',
    iconSize: [27, 39],
    iconAnchor: [13.5, 39],
  });

  public ngOnInit(): void {
    this.center = [
      this.currentCity().location.latitude,
      this.currentCity().location.longitude,
    ];
  }

  public ngAfterViewInit(): void {
    this.map = new L.Map('map', {
      center: this.center,
      zoomControl: false,
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        errorTileUrl:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
    );
    tiles.addTo(this.map);

    this.addMarkers();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    if (changes['activeCard']) {
      this.refreshMarkers();
    } else if (changes['offers']) {
      this.refreshMarkers();
      this.map.setView(
        [
          this.currentCity().location.latitude,
          this.currentCity().location.longitude,
        ],
        13,
        { animate: true },
      );
    }
  }

  public ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private addMarkers() {
    this.offers.forEach((offer) => {
      const marker = new L.Marker([
        offer.location.latitude,
        offer.location.longitude,
      ])
        .bindTooltip(offer.title, {
          permanent: false,
          direction: 'top',
          offset: [0, -20],
        })
        .setIcon(
          this.activeCard && this.activeCard.id === offer.id
            ? this.currentCustomIcon
            : this.defaultCustomIcon,
        )
        .addTo(this.map);
      this.markers.push(marker);
    });
  }

  private refreshMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.addMarkers();
  }
}
