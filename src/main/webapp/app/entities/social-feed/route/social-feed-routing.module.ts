import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SocialFeedComponent } from '../list/social-feed.component';
import { SocialFeedDetailComponent } from '../detail/social-feed-detail.component';
import { SocialFeedUpdateComponent } from '../update/social-feed-update.component';
import { SocialFeedRoutingResolveService } from './social-feed-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const socialFeedRoute: Routes = [
  {
    path: '',
    component: SocialFeedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SocialFeedDetailComponent,
    resolve: {
      socialFeed: SocialFeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SocialFeedUpdateComponent,
    resolve: {
      socialFeed: SocialFeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SocialFeedUpdateComponent,
    resolve: {
      socialFeed: SocialFeedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(socialFeedRoute)],
  exports: [RouterModule],
})
export class SocialFeedRoutingModule {}
