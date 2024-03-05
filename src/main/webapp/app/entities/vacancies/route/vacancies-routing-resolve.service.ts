import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacancies } from '../vacancies.model';
import { VacanciesService } from '../service/vacancies.service';

@Injectable({ providedIn: 'root' })
export class VacanciesRoutingResolveService implements Resolve<IVacancies | null> {
  constructor(protected service: VacanciesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVacancies | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vacancies: HttpResponse<IVacancies>) => {
          if (vacancies.body) {
            return of(vacancies.body);
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
