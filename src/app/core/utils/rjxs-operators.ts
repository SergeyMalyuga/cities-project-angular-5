import {catchError, MonoTypeOperatorFunction, retry, throwError, timeout, timer,} from 'rxjs';
import {RETRY_ATTEMPTS, TIMEOUT_MS} from '../constants/const';
import {httpErrorHandler} from './http-error-hadler';
import {HttpErrorResponse} from '@angular/common/http';

export function defaultHttpOperators<T>(): [
  MonoTypeOperatorFunction<T>,
  MonoTypeOperatorFunction<T>,
  MonoTypeOperatorFunction<T>,
] {
  return [
    timeout(TIMEOUT_MS),
    retry({
      count: RETRY_ATTEMPTS,
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status >= 500) {
          return timer(1500);
        }
        return throwError(() => error);
      },
    }),
    catchError(httpErrorHandler),
  ];
}
