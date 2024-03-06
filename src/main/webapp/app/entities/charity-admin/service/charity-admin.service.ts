import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharityAdmin, NewCharityAdmin } from '../charity-admin.model';

export type PartialUpdateCharityAdmin = Partial<ICharityAdmin> & Pick<ICharityAdmin, 'id'>;

export type EntityResponseType = HttpResponse<ICharityAdmin>;
export type EntityArrayResponseType = HttpResponse<ICharityAdmin[]>;

@Injectable({ providedIn: 'root' })
export class CharityAdminService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charity-admins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charityAdmin: NewCharityAdmin): Observable<EntityResponseType> {
    return this.http.post<ICharityAdmin>(this.resourceUrl, charityAdmin, { observe: 'response' });
  }

  update(charityAdmin: ICharityAdmin): Observable<EntityResponseType> {
    return this.http.put<ICharityAdmin>(`${this.resourceUrl}/${this.getCharityAdminIdentifier(charityAdmin)}`, charityAdmin, {
      observe: 'response',
    });
  }

  partialUpdate(charityAdmin: PartialUpdateCharityAdmin): Observable<EntityResponseType> {
    return this.http.patch<ICharityAdmin>(`${this.resourceUrl}/${this.getCharityAdminIdentifier(charityAdmin)}`, charityAdmin, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharityAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharityAdmin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityAdminIdentifier(charityAdmin: Pick<ICharityAdmin, 'id'>): number {
    return charityAdmin.id;
  }

  compareCharityAdmin(o1: Pick<ICharityAdmin, 'id'> | null, o2: Pick<ICharityAdmin, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityAdminIdentifier(o1) === this.getCharityAdminIdentifier(o2) : o1 === o2;
  }

  addCharityAdminToCollectionIfMissing<Type extends Pick<ICharityAdmin, 'id'>>(
    charityAdminCollection: Type[],
    ...charityAdminsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charityAdmins: Type[] = charityAdminsToCheck.filter(isPresent);
    if (charityAdmins.length > 0) {
      const charityAdminCollectionIdentifiers = charityAdminCollection.map(
        charityAdminItem => this.getCharityAdminIdentifier(charityAdminItem)!
      );
      const charityAdminsToAdd = charityAdmins.filter(charityAdminItem => {
        const charityAdminIdentifier = this.getCharityAdminIdentifier(charityAdminItem);
        if (charityAdminCollectionIdentifiers.includes(charityAdminIdentifier)) {
          return false;
        }
        charityAdminCollectionIdentifiers.push(charityAdminIdentifier);
        return true;
      });
      return [...charityAdminsToAdd, ...charityAdminCollection];
    }
    return charityAdminCollection;
  }
}
