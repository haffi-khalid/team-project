import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBudgetPlanner, NewBudgetPlanner } from '../budget-planner.model';

export type PartialUpdateBudgetPlanner = Partial<IBudgetPlanner> & Pick<IBudgetPlanner, 'id'>;

export type EntityResponseType = HttpResponse<IBudgetPlanner>;
export type EntityArrayResponseType = HttpResponse<IBudgetPlanner[]>;

@Injectable({ providedIn: 'root' })
export class BudgetPlannerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/budget-planners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(budgetPlanner: NewBudgetPlanner): Observable<EntityResponseType> {
    return this.http.post<IBudgetPlanner>(this.resourceUrl, budgetPlanner, { observe: 'response' });
  }

  update(budgetPlanner: IBudgetPlanner): Observable<EntityResponseType> {
    return this.http.put<IBudgetPlanner>(`${this.resourceUrl}/${this.getBudgetPlannerIdentifier(budgetPlanner)}`, budgetPlanner, {
      observe: 'response',
    });
  }

  partialUpdate(budgetPlanner: PartialUpdateBudgetPlanner): Observable<EntityResponseType> {
    return this.http.patch<IBudgetPlanner>(`${this.resourceUrl}/${this.getBudgetPlannerIdentifier(budgetPlanner)}`, budgetPlanner, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBudgetPlanner>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBudgetPlanner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBudgetPlannerIdentifier(budgetPlanner: Pick<IBudgetPlanner, 'id'>): number {
    return budgetPlanner.id;
  }

  compareBudgetPlanner(o1: Pick<IBudgetPlanner, 'id'> | null, o2: Pick<IBudgetPlanner, 'id'> | null): boolean {
    return o1 && o2 ? this.getBudgetPlannerIdentifier(o1) === this.getBudgetPlannerIdentifier(o2) : o1 === o2;
  }

  addBudgetPlannerToCollectionIfMissing<Type extends Pick<IBudgetPlanner, 'id'>>(
    budgetPlannerCollection: Type[],
    ...budgetPlannersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const budgetPlanners: Type[] = budgetPlannersToCheck.filter(isPresent);
    if (budgetPlanners.length > 0) {
      const budgetPlannerCollectionIdentifiers = budgetPlannerCollection.map(
        budgetPlannerItem => this.getBudgetPlannerIdentifier(budgetPlannerItem)!
      );
      const budgetPlannersToAdd = budgetPlanners.filter(budgetPlannerItem => {
        const budgetPlannerIdentifier = this.getBudgetPlannerIdentifier(budgetPlannerItem);
        if (budgetPlannerCollectionIdentifiers.includes(budgetPlannerIdentifier)) {
          return false;
        }
        budgetPlannerCollectionIdentifiers.push(budgetPlannerIdentifier);
        return true;
      });
      return [...budgetPlannersToAdd, ...budgetPlannerCollection];
    }
    return budgetPlannerCollection;
  }
}
