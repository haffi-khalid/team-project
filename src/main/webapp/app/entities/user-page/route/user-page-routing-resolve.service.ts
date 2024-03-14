import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPage } from '../user-page.model';
import { UserPageService } from '../service/user-page.service';

@Injectable({ providedIn: 'root' })
export class UserPageRoutingResolveService implements Resolve<IUserPage | null> {
  constructor(protected service: UserPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserPage | null | never> {
    console.log(route.params, '////route.params');
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userPage: HttpResponse<IUserPage>) => {
          if (userPage.body) {
            return of(userPage.body);
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
