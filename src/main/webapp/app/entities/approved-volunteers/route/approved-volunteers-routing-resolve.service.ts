import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApprovedVolunteers } from '../approved-volunteers.model';
import { ApprovedVolunteersService } from '../service/approved-volunteers.service';

@Injectable({ providedIn: 'root' })
export class ApprovedVolunteersRoutingResolveService implements Resolve<IApprovedVolunteers | null> {
  constructor(protected service: ApprovedVolunteersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApprovedVolunteers | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((approvedVolunteers: HttpResponse<IApprovedVolunteers>) => {
          if (approvedVolunteers.body) {
            return of(approvedVolunteers.body);
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
