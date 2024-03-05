import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICharityAdmin } from '../charity-admin.model';
import { CharityAdminService } from '../service/charity-admin.service';

@Injectable({ providedIn: 'root' })
export class CharityAdminRoutingResolveService implements Resolve<ICharityAdmin | null> {
  constructor(protected service: CharityAdminService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICharityAdmin | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((charityAdmin: HttpResponse<ICharityAdmin>) => {
          if (charityAdmin.body) {
            return of(charityAdmin.body);
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
