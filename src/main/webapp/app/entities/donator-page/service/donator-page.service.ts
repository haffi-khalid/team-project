import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDonatorPage, NewDonatorPage } from '../donator-page.model';

export type PartialUpdateDonatorPage = Partial<IDonatorPage> & Pick<IDonatorPage, 'id'>;

export type EntityResponseType = HttpResponse<IDonatorPage>;
export type EntityArrayResponseType = HttpResponse<IDonatorPage[]>;

@Injectable({ providedIn: 'root' })
export class DonatorPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/donator-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(donatorPage: NewDonatorPage): Observable<EntityResponseType> {
    return this.http.post<IDonatorPage>(this.resourceUrl, donatorPage, { observe: 'response' });
  }

  update(donatorPage: IDonatorPage): Observable<EntityResponseType> {
    return this.http.put<IDonatorPage>(`${this.resourceUrl}/${this.getDonatorPageIdentifier(donatorPage)}`, donatorPage, {
      observe: 'response',
    });
  }

  partialUpdate(donatorPage: PartialUpdateDonatorPage): Observable<EntityResponseType> {
    return this.http.patch<IDonatorPage>(`${this.resourceUrl}/${this.getDonatorPageIdentifier(donatorPage)}`, donatorPage, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDonatorPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDonatorPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDonatorPageIdentifier(donatorPage: Pick<IDonatorPage, 'id'>): number {
    return donatorPage.id;
  }

  compareDonatorPage(o1: Pick<IDonatorPage, 'id'> | null, o2: Pick<IDonatorPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getDonatorPageIdentifier(o1) === this.getDonatorPageIdentifier(o2) : o1 === o2;
  }

  addDonatorPageToCollectionIfMissing<Type extends Pick<IDonatorPage, 'id'>>(
    donatorPageCollection: Type[],
    ...donatorPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const donatorPages: Type[] = donatorPagesToCheck.filter(isPresent);
    if (donatorPages.length > 0) {
      const donatorPageCollectionIdentifiers = donatorPageCollection.map(
        donatorPageItem => this.getDonatorPageIdentifier(donatorPageItem)!
      );
      const donatorPagesToAdd = donatorPages.filter(donatorPageItem => {
        const donatorPageIdentifier = this.getDonatorPageIdentifier(donatorPageItem);
        if (donatorPageCollectionIdentifiers.includes(donatorPageIdentifier)) {
          return false;
        }
        donatorPageCollectionIdentifiers.push(donatorPageIdentifier);
        return true;
      });
      return [...donatorPagesToAdd, ...donatorPageCollection];
    }
    return donatorPageCollection;
  }
}
