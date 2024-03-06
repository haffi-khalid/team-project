import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAuthentication } from '../authentication.model';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationRoutingResolveService implements Resolve<IAuthentication | null> {
  constructor(protected service: AuthenticationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAuthentication | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((authentication: HttpResponse<IAuthentication>) => {
          if (authentication.body) {
            return of(authentication.body);
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
