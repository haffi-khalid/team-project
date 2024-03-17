import { Injectable } from '@angular/core';
import { VacanciesService } from '../../entities/vacancies/service/vacancies.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { IVacancies } from '../../entities/vacancies/vacancies.model';

@Injectable({
  providedIn: 'root',
})
export class NewApplicationsRoutingResolveService {
  constructor(protected service: VacanciesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVacancies | null | never> {
    const id = route.params['vacancyID'];
    if (id) {
      console.log('Ello');
      return this.service.find(id).pipe(
        mergeMap((vacancy: HttpResponse<IVacancies>) => {
          if (vacancy.body) {
            return of(vacancy.body);
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
