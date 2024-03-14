import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { IReviewComments, NewReviewComments } from '../review-comments.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ReviewCommentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/review-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reviewComments: NewReviewComments): Observable<IReviewComments> {
    const copy = this.convertDateFromClient(reviewComments);
    return this.http.post<IReviewComments>(this.resourceUrl, copy).pipe(map((res: any) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<IReviewComments[]> {
    const options = createRequestOption(req);
    return this.http
      .get<IReviewComments[]>(this.resourceUrl, { params: options })
      .pipe(map((res: any) => this.convertResponseArrayFromServer(res)));
  }

  update(reviewComments: IReviewComments): Observable<IReviewComments> {
    const copy = this.convertDateFromClient(reviewComments);
    return this.http
      .put<IReviewComments>(`${this.resourceUrl}/${reviewComments.id}`, copy)
      .pipe(map((res: any) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<IReviewComments> {
    return this.http.get<IReviewComments>(`${this.resourceUrl}/${id}`).pipe(map((res: any) => this.convertDateFromServer(res)));
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  addComment(comment: NewReviewComments): Observable<IReviewComments> {
    return this.create(comment);
  }

  addReply(commentId: number, reply: NewReviewComments): Observable<IReviewComments> {
    const replyUrl = `${this.resourceUrl}/${commentId}/replies`;
    return this.http.post<IReviewComments>(replyUrl, reply).pipe(map((res: any) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(comment: IReviewComments | NewReviewComments): IReviewComments | NewReviewComments {
    return {
      ...comment,
      // Only convert if timestamp is a string, otherwise assume it's already a Dayjs object or null.
      timestamp: typeof comment.timestamp === 'string' ? dayjs(comment.timestamp) : comment.timestamp,
    };
  }

  protected convertDateFromServer(res: IReviewComments): IReviewComments {
    return {
      ...res,
      // Convert the string timestamp from the server to a Dayjs object
      timestamp: res.timestamp ? dayjs(res.timestamp) : null,
    };
  }

  protected convertResponseArrayFromServer(res: IReviewComments[]): IReviewComments[] {
    return res.map(reviewComment => ({
      ...reviewComment,
      // Convert the string timestamp from the server to a Dayjs object
      timestamp: reviewComment.timestamp ? dayjs(reviewComment.timestamp) : null,
    }));
  }
}
