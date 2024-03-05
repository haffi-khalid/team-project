import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVolunteerApplications } from '../volunteer-applications.model';
import { VolunteerApplicationsService } from '../service/volunteer-applications.service';

@Injectable({ providedIn: 'root' })
export class VolunteerApplicationsRoutingResolveService implements Resolve<IVolunteerApplications | null> {
  constructor(protected service: VolunteerApplicationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVolunteerApplications | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((volunteerApplications: HttpResponse<IVolunteerApplications>) => {
          if (volunteerApplications.body) {
            return of(volunteerApplications.body);
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
