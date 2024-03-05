import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPage, NewUserPage } from '../user-page.model';

export type PartialUpdateUserPage = Partial<IUserPage> & Pick<IUserPage, 'id'>;

export type EntityResponseType = HttpResponse<IUserPage>;
export type EntityArrayResponseType = HttpResponse<IUserPage[]>;

@Injectable({ providedIn: 'root' })
export class UserPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userPage: NewUserPage): Observable<EntityResponseType> {
    return this.http.post<IUserPage>(this.resourceUrl, userPage, { observe: 'response' });
  }

  update(userPage: IUserPage): Observable<EntityResponseType> {
    return this.http.put<IUserPage>(`${this.resourceUrl}/${this.getUserPageIdentifier(userPage)}`, userPage, { observe: 'response' });
  }

  partialUpdate(userPage: PartialUpdateUserPage): Observable<EntityResponseType> {
    return this.http.patch<IUserPage>(`${this.resourceUrl}/${this.getUserPageIdentifier(userPage)}`, userPage, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserPageIdentifier(userPage: Pick<IUserPage, 'id'>): number {
    return userPage.id;
  }

  compareUserPage(o1: Pick<IUserPage, 'id'> | null, o2: Pick<IUserPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserPageIdentifier(o1) === this.getUserPageIdentifier(o2) : o1 === o2;
  }

  addUserPageToCollectionIfMissing<Type extends Pick<IUserPage, 'id'>>(
    userPageCollection: Type[],
    ...userPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userPages: Type[] = userPagesToCheck.filter(isPresent);
    if (userPages.length > 0) {
      const userPageCollectionIdentifiers = userPageCollection.map(userPageItem => this.getUserPageIdentifier(userPageItem)!);
      const userPagesToAdd = userPages.filter(userPageItem => {
        const userPageIdentifier = this.getUserPageIdentifier(userPageItem);
        if (userPageCollectionIdentifiers.includes(userPageIdentifier)) {
          return false;
        }
        userPageCollectionIdentifiers.push(userPageIdentifier);
        return true;
      });
      return [...userPagesToAdd, ...userPageCollection];
    }
    return userPageCollection;
  }
}
