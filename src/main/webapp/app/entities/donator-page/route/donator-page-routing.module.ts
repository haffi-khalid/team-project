import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DonatorPageComponent } from '../list/donator-page.component';
import { DonatorPageDetailComponent } from '../detail/donator-page-detail.component';
import { DonatorPageUpdateComponent } from '../update/donator-page-update.component';
import { DonatorPageRoutingResolveService } from './donator-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const donatorPageRoute: Routes = [
  {
    path: '',
    component: DonatorPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
  },
  {
    path: ':id/view',
    component: DonatorPageDetailComponent,
    resolve: {
      donatorPage: DonatorPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonatorPageUpdateComponent,
    resolve: {
      donatorPage: DonatorPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonatorPageUpdateComponent,
    resolve: {
      donatorPage: DonatorPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(donatorPageRoute)],
  exports: [RouterModule],
})
export class DonatorPageRoutingModule {}
