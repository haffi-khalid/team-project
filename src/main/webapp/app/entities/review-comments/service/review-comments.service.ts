import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReviewComments, NewReviewComments } from '../review-comments.model';

export type PartialUpdateReviewComments = Partial<IReviewComments> & Pick<IReviewComments, 'id'>;

type RestOf<T extends IReviewComments | NewReviewComments> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestReviewComments = RestOf<IReviewComments>;

export type NewRestReviewComments = RestOf<NewReviewComments>;

export type PartialUpdateRestReviewComments = RestOf<PartialUpdateReviewComments>;

export type EntityResponseType = HttpResponse<IReviewComments>;
export type EntityArrayResponseType = HttpResponse<IReviewComments[]>;

@Injectable({ providedIn: 'root' })
export class ReviewCommentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/review-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reviewComments: NewReviewComments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reviewComments);
    return this.http
      .post<RestReviewComments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reviewComments: IReviewComments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reviewComments);
    return this.http
      .put<RestReviewComments>(`${this.resourceUrl}/${this.getReviewCommentsIdentifier(reviewComments)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reviewComments: PartialUpdateReviewComments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reviewComments);
    return this.http
      .patch<RestReviewComments>(`${this.resourceUrl}/${this.getReviewCommentsIdentifier(reviewComments)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReviewComments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReviewComments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReviewCommentsIdentifier(reviewComments: Pick<IReviewComments, 'id'>): number {
    return reviewComments.id;
  }

  compareReviewComments(o1: Pick<IReviewComments, 'id'> | null, o2: Pick<IReviewComments, 'id'> | null): boolean {
    return o1 && o2 ? this.getReviewCommentsIdentifier(o1) === this.getReviewCommentsIdentifier(o2) : o1 === o2;
  }

  addReviewCommentsToCollectionIfMissing<Type extends Pick<IReviewComments, 'id'>>(
    reviewCommentsCollection: Type[],
    ...reviewCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reviewComments: Type[] = reviewCommentsToCheck.filter(isPresent);
    if (reviewComments.length > 0) {
      const reviewCommentsCollectionIdentifiers = reviewCommentsCollection.map(
        reviewCommentsItem => this.getReviewCommentsIdentifier(reviewCommentsItem)!
      );
      const reviewCommentsToAdd = reviewComments.filter(reviewCommentsItem => {
        const reviewCommentsIdentifier = this.getReviewCommentsIdentifier(reviewCommentsItem);
        if (reviewCommentsCollectionIdentifiers.includes(reviewCommentsIdentifier)) {
          return false;
        }
        reviewCommentsCollectionIdentifiers.push(reviewCommentsIdentifier);
        return true;
      });
      return [...reviewCommentsToAdd, ...reviewCommentsCollection];
    }
    return reviewCommentsCollection;
  }

  protected convertDateFromClient<T extends IReviewComments | NewReviewComments | PartialUpdateReviewComments>(
    reviewComments: T
  ): RestOf<T> {
    return {
      ...reviewComments,
      timestamp: reviewComments.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReviewComments: RestReviewComments): IReviewComments {
    return {
      ...restReviewComments,
      timestamp: restReviewComments.timestamp ? dayjs(restReviewComments.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReviewComments>): HttpResponse<IReviewComments> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReviewComments[]>): HttpResponse<IReviewComments[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
