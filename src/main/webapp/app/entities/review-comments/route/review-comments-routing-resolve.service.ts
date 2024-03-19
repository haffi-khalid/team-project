import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReviewComments } from '../review-comments.model';
import { ReviewCommentsService } from '../service/review-comments.service';

@Injectable({ providedIn: 'root' })
export class ReviewCommentsRoutingResolveService implements Resolve<IReviewComments | null> {
  constructor(protected service: ReviewCommentsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReviewComments | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reviewComments: HttpResponse<IReviewComments>) => {
          if (reviewComments.body) {
            return of(reviewComments.body);
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
