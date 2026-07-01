import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function httpErrorHandler(error: HttpErrorResponse) {
  console.error(error);
  return throwError(() => error.message);
}
