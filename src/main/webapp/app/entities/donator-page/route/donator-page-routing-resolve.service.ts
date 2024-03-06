import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDonatorPage } from '../donator-page.model';
import { DonatorPageService } from '../service/donator-page.service';

@Injectable({ providedIn: 'root' })
export class DonatorPageRoutingResolveService implements Resolve<IDonatorPage | null> {
  constructor(protected service: DonatorPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDonatorPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((donatorPage: HttpResponse<IDonatorPage>) => {
          if (donatorPage.body) {
            return of(donatorPage.body);
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
