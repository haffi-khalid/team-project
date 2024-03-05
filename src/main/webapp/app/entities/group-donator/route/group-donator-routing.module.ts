import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GroupDonatorComponent } from '../list/group-donator.component';
import { GroupDonatorDetailComponent } from '../detail/group-donator-detail.component';
import { GroupDonatorUpdateComponent } from '../update/group-donator-update.component';
import { GroupDonatorRoutingResolveService } from './group-donator-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const groupDonatorRoute: Routes = [
  {
    path: '',
    component: GroupDonatorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GroupDonatorDetailComponent,
    resolve: {
      groupDonator: GroupDonatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GroupDonatorUpdateComponent,
    resolve: {
      groupDonator: GroupDonatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GroupDonatorUpdateComponent,
    resolve: {
      groupDonator: GroupDonatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(groupDonatorRoute)],
  exports: [RouterModule],
})
export class GroupDonatorRoutingModule {}
