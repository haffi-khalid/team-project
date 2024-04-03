import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFundraisingIdea, NewFundraisingIdea } from '../fundraising-idea.model';

export type PartialUpdateFundraisingIdea = Partial<IFundraisingIdea> & Pick<IFundraisingIdea, 'id'>;

export type EntityResponseType = HttpResponse<IFundraisingIdea>;
export type EntityArrayResponseType = HttpResponse<IFundraisingIdea[]>;

@Injectable({ providedIn: 'root' })
export class FundraisingIdeaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fundraising-ideas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fundraisingIdea: NewFundraisingIdea): Observable<EntityResponseType> {
    return this.http.post<IFundraisingIdea>(this.resourceUrl, fundraisingIdea, { observe: 'response' });
  }

  update(fundraisingIdea: IFundraisingIdea): Observable<EntityResponseType> {
    return this.http.put<IFundraisingIdea>(`${this.resourceUrl}/${this.getFundraisingIdeaIdentifier(fundraisingIdea)}`, fundraisingIdea, {
      observe: 'response',
    });
  }

  partialUpdate(fundraisingIdea: PartialUpdateFundraisingIdea): Observable<EntityResponseType> {
    return this.http.patch<IFundraisingIdea>(`${this.resourceUrl}/${this.getFundraisingIdeaIdentifier(fundraisingIdea)}`, fundraisingIdea, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFundraisingIdea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFundraisingIdea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFundraisingIdeaIdentifier(fundraisingIdea: Pick<IFundraisingIdea, 'id'>): number {
    return fundraisingIdea.id;
  }

  compareFundraisingIdea(o1: Pick<IFundraisingIdea, 'id'> | null, o2: Pick<IFundraisingIdea, 'id'> | null): boolean {
    return o1 && o2 ? this.getFundraisingIdeaIdentifier(o1) === this.getFundraisingIdeaIdentifier(o2) : o1 === o2;
  }

  getRandomIdea(): Observable<IFundraisingIdea> {
    return this.http.get<IFundraisingIdea>(`api/random`);
  }

  searchIdeas(idea: IFundraisingIdea): Observable<IFundraisingIdea[]> {
    return this.http.post<IFundraisingIdea[]>('/api/search', idea);
  }

  addFundraisingIdeaToCollectionIfMissing<Type extends Pick<IFundraisingIdea, 'id'>>(
    fundraisingIdeaCollection: Type[],
    ...fundraisingIdeasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fundraisingIdeas: Type[] = fundraisingIdeasToCheck.filter(isPresent);
    if (fundraisingIdeas.length > 0) {
      const fundraisingIdeaCollectionIdentifiers = fundraisingIdeaCollection.map(
        fundraisingIdeaItem => this.getFundraisingIdeaIdentifier(fundraisingIdeaItem)!
      );
      const fundraisingIdeasToAdd = fundraisingIdeas.filter(fundraisingIdeaItem => {
        const fundraisingIdeaIdentifier = this.getFundraisingIdeaIdentifier(fundraisingIdeaItem);
        if (fundraisingIdeaCollectionIdentifiers.includes(fundraisingIdeaIdentifier)) {
          return false;
        }
        fundraisingIdeaCollectionIdentifiers.push(fundraisingIdeaIdentifier);
        return true;
      });
      return [...fundraisingIdeasToAdd, ...fundraisingIdeaCollection];
    }
    return fundraisingIdeaCollection;
  }
}
