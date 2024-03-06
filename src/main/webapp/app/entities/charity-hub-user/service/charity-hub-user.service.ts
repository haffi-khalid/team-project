import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharityHubUser, NewCharityHubUser } from '../charity-hub-user.model';

export type PartialUpdateCharityHubUser = Partial<ICharityHubUser> & Pick<ICharityHubUser, 'id'>;

export type EntityResponseType = HttpResponse<ICharityHubUser>;
export type EntityArrayResponseType = HttpResponse<ICharityHubUser[]>;

@Injectable({ providedIn: 'root' })
export class CharityHubUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charity-hub-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charityHubUser: NewCharityHubUser): Observable<EntityResponseType> {
    return this.http.post<ICharityHubUser>(this.resourceUrl, charityHubUser, { observe: 'response' });
  }

  update(charityHubUser: ICharityHubUser): Observable<EntityResponseType> {
    return this.http.put<ICharityHubUser>(`${this.resourceUrl}/${this.getCharityHubUserIdentifier(charityHubUser)}`, charityHubUser, {
      observe: 'response',
    });
  }

  partialUpdate(charityHubUser: PartialUpdateCharityHubUser): Observable<EntityResponseType> {
    return this.http.patch<ICharityHubUser>(`${this.resourceUrl}/${this.getCharityHubUserIdentifier(charityHubUser)}`, charityHubUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharityHubUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharityHubUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityHubUserIdentifier(charityHubUser: Pick<ICharityHubUser, 'id'>): number {
    return charityHubUser.id;
  }

  compareCharityHubUser(o1: Pick<ICharityHubUser, 'id'> | null, o2: Pick<ICharityHubUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityHubUserIdentifier(o1) === this.getCharityHubUserIdentifier(o2) : o1 === o2;
  }

  addCharityHubUserToCollectionIfMissing<Type extends Pick<ICharityHubUser, 'id'>>(
    charityHubUserCollection: Type[],
    ...charityHubUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charityHubUsers: Type[] = charityHubUsersToCheck.filter(isPresent);
    if (charityHubUsers.length > 0) {
      const charityHubUserCollectionIdentifiers = charityHubUserCollection.map(
        charityHubUserItem => this.getCharityHubUserIdentifier(charityHubUserItem)!
      );
      const charityHubUsersToAdd = charityHubUsers.filter(charityHubUserItem => {
        const charityHubUserIdentifier = this.getCharityHubUserIdentifier(charityHubUserItem);
        if (charityHubUserCollectionIdentifiers.includes(charityHubUserIdentifier)) {
          return false;
        }
        charityHubUserCollectionIdentifiers.push(charityHubUserIdentifier);
        return true;
      });
      return [...charityHubUsersToAdd, ...charityHubUserCollection];
    }
    return charityHubUserCollection;
  }
}
