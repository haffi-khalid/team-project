import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApprovedVolunteers, NewApprovedVolunteers } from '../approved-volunteers.model';

export type PartialUpdateApprovedVolunteers = Partial<IApprovedVolunteers> & Pick<IApprovedVolunteers, 'id'>;

export type EntityResponseType = HttpResponse<IApprovedVolunteers>;
export type EntityArrayResponseType = HttpResponse<IApprovedVolunteers[]>;

@Injectable({ providedIn: 'root' })
export class ApprovedVolunteersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/approved-volunteers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(approvedVolunteers: NewApprovedVolunteers): Observable<EntityResponseType> {
    return this.http.post<IApprovedVolunteers>(this.resourceUrl, approvedVolunteers, { observe: 'response' });
  }

  update(approvedVolunteers: IApprovedVolunteers): Observable<EntityResponseType> {
    return this.http.put<IApprovedVolunteers>(
      `${this.resourceUrl}/${this.getApprovedVolunteersIdentifier(approvedVolunteers)}`,
      approvedVolunteers,
      { observe: 'response' }
    );
  }

  partialUpdate(approvedVolunteers: PartialUpdateApprovedVolunteers): Observable<EntityResponseType> {
    return this.http.patch<IApprovedVolunteers>(
      `${this.resourceUrl}/${this.getApprovedVolunteersIdentifier(approvedVolunteers)}`,
      approvedVolunteers,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApprovedVolunteers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApprovedVolunteers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getApprovedVolunteersIdentifier(approvedVolunteers: Pick<IApprovedVolunteers, 'id'>): number {
    return approvedVolunteers.id;
  }

  compareApprovedVolunteers(o1: Pick<IApprovedVolunteers, 'id'> | null, o2: Pick<IApprovedVolunteers, 'id'> | null): boolean {
    return o1 && o2 ? this.getApprovedVolunteersIdentifier(o1) === this.getApprovedVolunteersIdentifier(o2) : o1 === o2;
  }

  addApprovedVolunteersToCollectionIfMissing<Type extends Pick<IApprovedVolunteers, 'id'>>(
    approvedVolunteersCollection: Type[],
    ...approvedVolunteersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const approvedVolunteers: Type[] = approvedVolunteersToCheck.filter(isPresent);
    if (approvedVolunteers.length > 0) {
      const approvedVolunteersCollectionIdentifiers = approvedVolunteersCollection.map(
        approvedVolunteersItem => this.getApprovedVolunteersIdentifier(approvedVolunteersItem)!
      );
      const approvedVolunteersToAdd = approvedVolunteers.filter(approvedVolunteersItem => {
        const approvedVolunteersIdentifier = this.getApprovedVolunteersIdentifier(approvedVolunteersItem);
        if (approvedVolunteersCollectionIdentifiers.includes(approvedVolunteersIdentifier)) {
          return false;
        }
        approvedVolunteersCollectionIdentifiers.push(approvedVolunteersIdentifier);
        return true;
      });
      return [...approvedVolunteersToAdd, ...approvedVolunteersCollection];
    }
    return approvedVolunteersCollection;
  }
}
