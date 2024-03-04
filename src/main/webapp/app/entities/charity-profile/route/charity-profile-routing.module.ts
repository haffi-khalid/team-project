import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityProfileComponent } from '../list/charity-profile.component';
import { CharityProfileDetailComponent } from '../detail/charity-profile-detail.component';
import { CharityProfileUpdateComponent } from '../update/charity-profile-update.component';
import { CharityProfileRoutingResolveService } from './charity-profile-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityProfileRoute: Routes = [
  {
    path: '',
    component: CharityProfileComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityProfileDetailComponent,
    resolve: {
      charityProfile: CharityProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityProfileUpdateComponent,
    resolve: {
      charityProfile: CharityProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityProfileUpdateComponent,
    resolve: {
      charityProfile: CharityProfileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityProfileRoute)],
  exports: [RouterModule],
})
export class CharityProfileRoutingModule {}
