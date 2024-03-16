import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFundraisingIdea } from '../fundraising-idea.model';
import { FundraisingIdeaService } from '../service/fundraising-idea.service';

@Injectable({ providedIn: 'root' })
export class FundraisingIdeaRoutingResolveService implements Resolve<IFundraisingIdea | null> {
  constructor(protected service: FundraisingIdeaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFundraisingIdea | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fundraisingIdea: HttpResponse<IFundraisingIdea>) => {
          if (fundraisingIdea.body) {
            return of(fundraisingIdea.body);
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
