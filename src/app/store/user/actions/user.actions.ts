import {createAction, props} from '@ngrx/store';
import {User} from '../../../core/models/user';
import {HttpErrorResponse} from '@angular/common/http';
import {Credentials} from '../../../core/models/credentials';

export const checkAuth = createAction('[App Component] Check Auth');
export const checkAuthSuccess = createAction(
  '[User Effects] Check Auth Success',
  props<{ user: User }>(),
);
export const checkAuthFailure = createAction(
  '[User Effects] Check Auth Failure',
  props<{ error: HttpErrorResponse | string }>(),
);

export const login = createAction(
  '[Login Component] Login',
  props<{ credentials: Credentials }>(),
);
export const loginSuccess = createAction(
  '[User Effects] Login Success',
  props<{ user: User }>(),
);
export const loginFailure = createAction(
  '[User Effects] Login Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const logout = createAction('[Header Component] Logout');
export const logoutSuccess = createAction('[User Effects] Logout Success');
export const logoutFailure = createAction(
  '[User Effects] Logout Failure',
  props<{ error: HttpErrorResponse }>(),
);
