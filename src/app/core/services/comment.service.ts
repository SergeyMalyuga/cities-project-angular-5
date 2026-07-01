import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comments';
import { Observable } from 'rxjs';
import { APIRoute, BASE_URL } from '../constants/const';
import { defaultHttpOperators } from '../utils/rjxs-operators';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  public getComments(offerId: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${BASE_URL}/${APIRoute.COMMENTS}/${offerId}`)
      .pipe(...defaultHttpOperators<Comment[]>());
  }

  public postComment(
    offerId: string,
    comment: string,
    rating: number,
  ): Observable<Comment> {
    return this.http
      .post<Comment>(`${BASE_URL}/${APIRoute.COMMENTS}/${offerId}`, {
        comment,
        rating,
      })
      .pipe(...defaultHttpOperators<Comment>());
  }
}
