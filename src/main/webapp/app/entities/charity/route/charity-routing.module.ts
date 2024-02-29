import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityComponent } from '../list/charity.component';
import { CharityDetailComponent } from '../detail/charity-detail.component';
import { CharityUpdateComponent } from '../update/charity-update.component';
import { CharityRoutingResolveService } from './charity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityRoute: Routes = [
  {
    path: '',
    component: CharityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityDetailComponent,
    resolve: {
      charity: CharityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityUpdateComponent,
    resolve: {
      charity: CharityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityUpdateComponent,
    resolve: {
      charity: CharityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityRoute)],
  exports: [RouterModule],
})
export class CharityRoutingModule {}
