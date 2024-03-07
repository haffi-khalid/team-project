import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGroupDonator } from '../group-donator.model';
import { GroupDonatorService } from '../service/group-donator.service';

@Injectable({ providedIn: 'root' })
export class GroupDonatorRoutingResolveService implements Resolve<IGroupDonator | null> {
  constructor(protected service: GroupDonatorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGroupDonator | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((groupDonator: HttpResponse<IGroupDonator>) => {
          if (groupDonator.body) {
            return of(groupDonator.body);
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
