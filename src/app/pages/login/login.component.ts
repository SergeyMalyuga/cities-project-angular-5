import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AppRoute,
  AuthorizationStatus,
  CITY_LOCATIONS,
} from '../../core/constants/const';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/models/app.state';
import { Credentials } from '../../core/models/credentials';
import { login } from '../../store/user/actions/user.actions';
import { selectAuthStatus } from '../../store/user/selectors/user.selectors';
import { first } from 'rxjs';
import { loadOffers } from '../../store/offer/actions/offer.actions';
import { loadFavoriteOffers } from '../../store/favorite-offer/actions/favorite-offer.actions';
import { changeCity } from '../../store/city/actions/city.actions';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected readonly AppRoute = AppRoute;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$'),
      ],
    ],
  });

  public randomCity = this.getRandomCity();

  public ngOnInit(): void {
    this.store
      .select(selectAuthStatus)
      .pipe(first((authStatus) => authStatus === AuthorizationStatus.AUTH))
      .subscribe(() => {
        this.loginForm.reset();
        this.store.dispatch(loadOffers());
        this.store.dispatch(loadFavoriteOffers());
        this.router.navigate([AppRoute.MAIN]);
      });
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const credentials: Credentials = { email, password };
      this.store.dispatch(login({ credentials }));
    }
  }

  public get passwordControl() {
    return this.loginForm.get('password');
  }

  public get emailControl() {
    return this.loginForm.get('email');
  }

  private getRandomCity() {
    const index = Math.floor(Math.random() * CITY_LOCATIONS.length);
    return CITY_LOCATIONS[index];
  }

  public changeCity() {
    this.store.dispatch(changeCity({ city: this.randomCity }));
    this.router.navigate([AppRoute.MAIN]);
  }
}
