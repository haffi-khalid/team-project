import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FundraisingIdeaComponent } from '../list/fundraising-idea.component';
import { FundraisingIdeaDetailComponent } from '../detail/fundraising-idea-detail.component';
import { FundraisingIdeaUpdateComponent } from '../update/fundraising-idea-update.component';
import { FundraisingIdeaRoutingResolveService } from './fundraising-idea-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const fundraisingIdeaRoute: Routes = [
  {
    path: '',
    component: FundraisingIdeaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FundraisingIdeaDetailComponent,
    resolve: {
      fundraisingIdea: FundraisingIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FundraisingIdeaUpdateComponent,
    resolve: {
      fundraisingIdea: FundraisingIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FundraisingIdeaUpdateComponent,
    resolve: {
      fundraisingIdea: FundraisingIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fundraisingIdeaRoute)],
  exports: [RouterModule],
})
export class FundraisingIdeaRoutingModule {}
