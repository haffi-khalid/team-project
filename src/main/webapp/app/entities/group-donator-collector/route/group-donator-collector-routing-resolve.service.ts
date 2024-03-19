import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGroupDonatorCollector } from '../group-donator-collector.model';
import { GroupDonatorCollectorService } from '../service/group-donator-collector.service';

@Injectable({ providedIn: 'root' })
export class GroupDonatorCollectorRoutingResolveService implements Resolve<IGroupDonatorCollector | null> {
  constructor(protected service: GroupDonatorCollectorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGroupDonatorCollector | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((groupDonatorCollector: HttpResponse<IGroupDonatorCollector>) => {
          if (groupDonatorCollector.body) {
            return of(groupDonatorCollector.body);
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
