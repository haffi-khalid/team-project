import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPosts } from '../posts.model';
import { PostsService } from '../service/posts.service';

@Injectable({ providedIn: 'root' })
export class PostsRoutingResolveService implements Resolve<IPosts | null> {
  constructor(protected service: PostsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPosts | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((posts: HttpResponse<IPosts>) => {
          if (posts.body) {
            return of(posts.body);
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
