import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppRoute} from '../../core/constants/const';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  protected readonly AppRoute = AppRoute;
}
