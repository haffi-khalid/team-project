import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISocialFeed } from '../social-feed.model';
import { SocialFeedService } from '../service/social-feed.service';

@Injectable({ providedIn: 'root' })
export class SocialFeedRoutingResolveService implements Resolve<ISocialFeed | null> {
  constructor(protected service: SocialFeedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISocialFeed | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((socialFeed: HttpResponse<ISocialFeed>) => {
          if (socialFeed.body) {
            return of(socialFeed.body);
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
