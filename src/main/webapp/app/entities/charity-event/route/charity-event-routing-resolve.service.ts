import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICharityEvent } from '../charity-event.model';
import { CharityEventService } from '../service/charity-event.service';

@Injectable({ providedIn: 'root' })
export class CharityEventRoutingResolveService implements Resolve<ICharityEvent | null> {
  constructor(protected service: CharityEventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICharityEvent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((charityEvent: HttpResponse<ICharityEvent>) => {
          if (charityEvent.body) {
            return of(charityEvent.body);
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
