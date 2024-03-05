import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityHubUserComponent } from '../list/charity-hub-user.component';
import { CharityHubUserDetailComponent } from '../detail/charity-hub-user-detail.component';
import { CharityHubUserUpdateComponent } from '../update/charity-hub-user-update.component';
import { CharityHubUserRoutingResolveService } from './charity-hub-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityHubUserRoute: Routes = [
  {
    path: '',
    component: CharityHubUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityHubUserDetailComponent,
    resolve: {
      charityHubUser: CharityHubUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityHubUserUpdateComponent,
    resolve: {
      charityHubUser: CharityHubUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityHubUserUpdateComponent,
    resolve: {
      charityHubUser: CharityHubUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityHubUserRoute)],
  exports: [RouterModule],
})
export class CharityHubUserRoutingModule {}
