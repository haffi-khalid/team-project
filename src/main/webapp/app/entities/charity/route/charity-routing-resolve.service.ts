import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICharity } from '../charity.model';
import { CharityService } from '../service/charity.service';

@Injectable({ providedIn: 'root' })
export class CharityRoutingResolveService implements Resolve<ICharity | null> {
  constructor(protected service: CharityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICharity | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((charity: HttpResponse<ICharity>) => {
          if (charity.body) {
            return of(charity.body);
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
