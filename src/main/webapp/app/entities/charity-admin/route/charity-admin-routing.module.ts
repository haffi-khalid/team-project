import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityAdminComponent } from '../list/charity-admin.component';
import { CharityAdminDetailComponent } from '../detail/charity-admin-detail.component';
import { CharityAdminUpdateComponent } from '../update/charity-admin-update.component';
import { CharityAdminRoutingResolveService } from './charity-admin-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityAdminRoute: Routes = [
  {
    path: '',
    component: CharityAdminComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityAdminDetailComponent,
    resolve: {
      charityAdmin: CharityAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityAdminUpdateComponent,
    resolve: {
      charityAdmin: CharityAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityAdminUpdateComponent,
    resolve: {
      charityAdmin: CharityAdminRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityAdminRoute)],
  exports: [RouterModule],
})
export class CharityAdminRoutingModule {}
