import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGroupDonatorCollector, NewGroupDonatorCollector } from '../group-donator-collector.model';

export type PartialUpdateGroupDonatorCollector = Partial<IGroupDonatorCollector> & Pick<IGroupDonatorCollector, 'id'>;

export type EntityResponseType = HttpResponse<IGroupDonatorCollector>;
export type EntityArrayResponseType = HttpResponse<IGroupDonatorCollector[]>;

@Injectable({ providedIn: 'root' })
export class GroupDonatorCollectorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/group-donator-collectors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(groupDonatorCollector: NewGroupDonatorCollector): Observable<EntityResponseType> {
    return this.http.post<IGroupDonatorCollector>(this.resourceUrl, groupDonatorCollector, { observe: 'response' });
  }

  update(groupDonatorCollector: IGroupDonatorCollector): Observable<EntityResponseType> {
    return this.http.put<IGroupDonatorCollector>(
      `${this.resourceUrl}/${this.getGroupDonatorCollectorIdentifier(groupDonatorCollector)}`,
      groupDonatorCollector,
      { observe: 'response' }
    );
  }

  partialUpdate(groupDonatorCollector: PartialUpdateGroupDonatorCollector): Observable<EntityResponseType> {
    return this.http.patch<IGroupDonatorCollector>(
      `${this.resourceUrl}/${this.getGroupDonatorCollectorIdentifier(groupDonatorCollector)}`,
      groupDonatorCollector,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroupDonatorCollector>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroupDonatorCollector[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGroupDonatorCollectorIdentifier(groupDonatorCollector: Pick<IGroupDonatorCollector, 'id'>): number {
    return groupDonatorCollector.id;
  }

  compareGroupDonatorCollector(o1: Pick<IGroupDonatorCollector, 'id'> | null, o2: Pick<IGroupDonatorCollector, 'id'> | null): boolean {
    return o1 && o2 ? this.getGroupDonatorCollectorIdentifier(o1) === this.getGroupDonatorCollectorIdentifier(o2) : o1 === o2;
  }

  addGroupDonatorCollectorToCollectionIfMissing<Type extends Pick<IGroupDonatorCollector, 'id'>>(
    groupDonatorCollectorCollection: Type[],
    ...groupDonatorCollectorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const groupDonatorCollectors: Type[] = groupDonatorCollectorsToCheck.filter(isPresent);
    if (groupDonatorCollectors.length > 0) {
      const groupDonatorCollectorCollectionIdentifiers = groupDonatorCollectorCollection.map(
        groupDonatorCollectorItem => this.getGroupDonatorCollectorIdentifier(groupDonatorCollectorItem)!
      );
      const groupDonatorCollectorsToAdd = groupDonatorCollectors.filter(groupDonatorCollectorItem => {
        const groupDonatorCollectorIdentifier = this.getGroupDonatorCollectorIdentifier(groupDonatorCollectorItem);
        if (groupDonatorCollectorCollectionIdentifiers.includes(groupDonatorCollectorIdentifier)) {
          return false;
        }
        groupDonatorCollectorCollectionIdentifiers.push(groupDonatorCollectorIdentifier);
        return true;
      });
      return [...groupDonatorCollectorsToAdd, ...groupDonatorCollectorCollection];
    }
    return groupDonatorCollectorCollection;
  }
}
