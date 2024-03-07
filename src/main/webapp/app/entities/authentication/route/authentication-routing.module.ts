import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuthenticationComponent } from '../list/authentication.component';
import { AuthenticationDetailComponent } from '../detail/authentication-detail.component';
import { AuthenticationUpdateComponent } from '../update/authentication-update.component';
import { AuthenticationRoutingResolveService } from './authentication-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const authenticationRoute: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthenticationDetailComponent,
    resolve: {
      authentication: AuthenticationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthenticationUpdateComponent,
    resolve: {
      authentication: AuthenticationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthenticationUpdateComponent,
    resolve: {
      authentication: AuthenticationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoute)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
