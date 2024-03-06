import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGroupDonator, NewGroupDonator } from '../group-donator.model';

export type PartialUpdateGroupDonator = Partial<IGroupDonator> & Pick<IGroupDonator, 'id'>;

export type EntityResponseType = HttpResponse<IGroupDonator>;
export type EntityArrayResponseType = HttpResponse<IGroupDonator[]>;

@Injectable({ providedIn: 'root' })
export class GroupDonatorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/group-donators');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(groupDonator: NewGroupDonator): Observable<EntityResponseType> {
    return this.http.post<IGroupDonator>(this.resourceUrl, groupDonator, { observe: 'response' });
  }

  update(groupDonator: IGroupDonator): Observable<EntityResponseType> {
    return this.http.put<IGroupDonator>(`${this.resourceUrl}/${this.getGroupDonatorIdentifier(groupDonator)}`, groupDonator, {
      observe: 'response',
    });
  }

  partialUpdate(groupDonator: PartialUpdateGroupDonator): Observable<EntityResponseType> {
    return this.http.patch<IGroupDonator>(`${this.resourceUrl}/${this.getGroupDonatorIdentifier(groupDonator)}`, groupDonator, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroupDonator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroupDonator[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGroupDonatorIdentifier(groupDonator: Pick<IGroupDonator, 'id'>): number {
    return groupDonator.id;
  }

  compareGroupDonator(o1: Pick<IGroupDonator, 'id'> | null, o2: Pick<IGroupDonator, 'id'> | null): boolean {
    return o1 && o2 ? this.getGroupDonatorIdentifier(o1) === this.getGroupDonatorIdentifier(o2) : o1 === o2;
  }

  addGroupDonatorToCollectionIfMissing<Type extends Pick<IGroupDonator, 'id'>>(
    groupDonatorCollection: Type[],
    ...groupDonatorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const groupDonators: Type[] = groupDonatorsToCheck.filter(isPresent);
    if (groupDonators.length > 0) {
      const groupDonatorCollectionIdentifiers = groupDonatorCollection.map(
        groupDonatorItem => this.getGroupDonatorIdentifier(groupDonatorItem)!
      );
      const groupDonatorsToAdd = groupDonators.filter(groupDonatorItem => {
        const groupDonatorIdentifier = this.getGroupDonatorIdentifier(groupDonatorItem);
        if (groupDonatorCollectionIdentifiers.includes(groupDonatorIdentifier)) {
          return false;
        }
        groupDonatorCollectionIdentifiers.push(groupDonatorIdentifier);
        return true;
      });
      return [...groupDonatorsToAdd, ...groupDonatorCollection];
    }
    return groupDonatorCollection;
  }
}
