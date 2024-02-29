import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharity, NewCharity } from '../charity.model';

export type PartialUpdateCharity = Partial<ICharity> & Pick<ICharity, 'id'>;

export type EntityResponseType = HttpResponse<ICharity>;
export type EntityArrayResponseType = HttpResponse<ICharity[]>;

@Injectable({ providedIn: 'root' })
export class CharityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charity: NewCharity): Observable<EntityResponseType> {
    return this.http.post<ICharity>(this.resourceUrl, charity, { observe: 'response' });
  }

  update(charity: ICharity): Observable<EntityResponseType> {
    return this.http.put<ICharity>(`${this.resourceUrl}/${this.getCharityIdentifier(charity)}`, charity, { observe: 'response' });
  }

  partialUpdate(charity: PartialUpdateCharity): Observable<EntityResponseType> {
    return this.http.patch<ICharity>(`${this.resourceUrl}/${this.getCharityIdentifier(charity)}`, charity, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityIdentifier(charity: Pick<ICharity, 'id'>): number {
    return charity.id;
  }

  compareCharity(o1: Pick<ICharity, 'id'> | null, o2: Pick<ICharity, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityIdentifier(o1) === this.getCharityIdentifier(o2) : o1 === o2;
  }

  addCharityToCollectionIfMissing<Type extends Pick<ICharity, 'id'>>(
    charityCollection: Type[],
    ...charitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charities: Type[] = charitiesToCheck.filter(isPresent);
    if (charities.length > 0) {
      const charityCollectionIdentifiers = charityCollection.map(charityItem => this.getCharityIdentifier(charityItem)!);
      const charitiesToAdd = charities.filter(charityItem => {
        const charityIdentifier = this.getCharityIdentifier(charityItem);
        if (charityCollectionIdentifiers.includes(charityIdentifier)) {
          return false;
        }
        charityCollectionIdentifiers.push(charityIdentifier);
        return true;
      });
      return [...charitiesToAdd, ...charityCollection];
    }
    return charityCollection;
  }
}
