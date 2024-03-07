import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReviewCommentsComponent } from '../list/review-comments.component';
import { ReviewCommentsDetailComponent } from '../detail/review-comments-detail.component';
import { ReviewCommentsUpdateComponent } from '../update/review-comments-update.component';
import { ReviewCommentsRoutingResolveService } from './review-comments-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const reviewCommentsRoute: Routes = [
  {
    path: '',
    component: ReviewCommentsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReviewCommentsDetailComponent,
    resolve: {
      reviewComments: ReviewCommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReviewCommentsUpdateComponent,
    resolve: {
      reviewComments: ReviewCommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReviewCommentsUpdateComponent,
    resolve: {
      reviewComments: ReviewCommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reviewCommentsRoute)],
  exports: [RouterModule],
})
export class ReviewCommentsRoutingModule {}
