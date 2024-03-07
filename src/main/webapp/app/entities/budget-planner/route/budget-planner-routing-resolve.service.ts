import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBudgetPlanner } from '../budget-planner.model';
import { BudgetPlannerService } from '../service/budget-planner.service';

@Injectable({ providedIn: 'root' })
export class BudgetPlannerRoutingResolveService implements Resolve<IBudgetPlanner | null> {
  constructor(protected service: BudgetPlannerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBudgetPlanner | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((budgetPlanner: HttpResponse<IBudgetPlanner>) => {
          if (budgetPlanner.body) {
            return of(budgetPlanner.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
