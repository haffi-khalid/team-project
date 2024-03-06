import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICharityProfile } from '../charity-profile.model';
import { CharityProfileService } from '../service/charity-profile.service';

@Injectable({ providedIn: 'root' })
export class CharityProfileRoutingResolveService implements Resolve<ICharityProfile | null> {
  constructor(protected service: CharityProfileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICharityProfile | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((charityProfile: HttpResponse<ICharityProfile>) => {
          if (charityProfile.body) {
            return of(charityProfile.body);
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
