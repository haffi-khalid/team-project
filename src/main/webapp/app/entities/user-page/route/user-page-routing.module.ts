import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserPageComponent } from '../list/user-page.component';
import { UserPageDetailComponent } from '../detail/user-page-detail.component';
import { UserPageUpdateComponent } from '../update/user-page-update.component';
import { UserPageRoutingResolveService } from './user-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userPageRoute: Routes = [
  {
    path: '',
    component: UserPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserPageDetailComponent,
    resolve: {
      userPage: UserPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserPageUpdateComponent,
    resolve: {
      userPage: UserPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserPageUpdateComponent,
    resolve: {
      userPage: UserPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userPageRoute)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
