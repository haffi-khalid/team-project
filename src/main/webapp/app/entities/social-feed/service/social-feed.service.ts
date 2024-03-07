import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISocialFeed, NewSocialFeed } from '../social-feed.model';

export type PartialUpdateSocialFeed = Partial<ISocialFeed> & Pick<ISocialFeed, 'id'>;

type RestOf<T extends ISocialFeed | NewSocialFeed> = Omit<T, 'lastUpdated'> & {
  lastUpdated?: string | null;
};

export type RestSocialFeed = RestOf<ISocialFeed>;

export type NewRestSocialFeed = RestOf<NewSocialFeed>;

export type PartialUpdateRestSocialFeed = RestOf<PartialUpdateSocialFeed>;

export type EntityResponseType = HttpResponse<ISocialFeed>;
export type EntityArrayResponseType = HttpResponse<ISocialFeed[]>;

@Injectable({ providedIn: 'root' })
export class SocialFeedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/social-feeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(socialFeed: NewSocialFeed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(socialFeed);
    return this.http
      .post<RestSocialFeed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(socialFeed: ISocialFeed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(socialFeed);
    return this.http
      .put<RestSocialFeed>(`${this.resourceUrl}/${this.getSocialFeedIdentifier(socialFeed)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(socialFeed: PartialUpdateSocialFeed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(socialFeed);
    return this.http
      .patch<RestSocialFeed>(`${this.resourceUrl}/${this.getSocialFeedIdentifier(socialFeed)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSocialFeed>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSocialFeed[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSocialFeedIdentifier(socialFeed: Pick<ISocialFeed, 'id'>): number {
    return socialFeed.id;
  }

  compareSocialFeed(o1: Pick<ISocialFeed, 'id'> | null, o2: Pick<ISocialFeed, 'id'> | null): boolean {
    return o1 && o2 ? this.getSocialFeedIdentifier(o1) === this.getSocialFeedIdentifier(o2) : o1 === o2;
  }

  addSocialFeedToCollectionIfMissing<Type extends Pick<ISocialFeed, 'id'>>(
    socialFeedCollection: Type[],
    ...socialFeedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const socialFeeds: Type[] = socialFeedsToCheck.filter(isPresent);
    if (socialFeeds.length > 0) {
      const socialFeedCollectionIdentifiers = socialFeedCollection.map(socialFeedItem => this.getSocialFeedIdentifier(socialFeedItem)!);
      const socialFeedsToAdd = socialFeeds.filter(socialFeedItem => {
        const socialFeedIdentifier = this.getSocialFeedIdentifier(socialFeedItem);
        if (socialFeedCollectionIdentifiers.includes(socialFeedIdentifier)) {
          return false;
        }
        socialFeedCollectionIdentifiers.push(socialFeedIdentifier);
        return true;
      });
      return [...socialFeedsToAdd, ...socialFeedCollection];
    }
    return socialFeedCollection;
  }

  protected convertDateFromClient<T extends ISocialFeed | NewSocialFeed | PartialUpdateSocialFeed>(socialFeed: T): RestOf<T> {
    return {
      ...socialFeed,
      lastUpdated: socialFeed.lastUpdated?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSocialFeed: RestSocialFeed): ISocialFeed {
    return {
      ...restSocialFeed,
      lastUpdated: restSocialFeed.lastUpdated ? dayjs(restSocialFeed.lastUpdated) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSocialFeed>): HttpResponse<ISocialFeed> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSocialFeed[]>): HttpResponse<ISocialFeed[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
