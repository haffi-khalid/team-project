import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GroupDonatorCollectorComponent } from '../list/group-donator-collector.component';
import { GroupDonatorCollectorDetailComponent } from '../detail/group-donator-collector-detail.component';
import { GroupDonatorCollectorUpdateComponent } from '../update/group-donator-collector-update.component';
import { GroupDonatorCollectorRoutingResolveService } from './group-donator-collector-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const groupDonatorCollectorRoute: Routes = [
  {
    path: '',
    component: GroupDonatorCollectorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GroupDonatorCollectorDetailComponent,
    resolve: {
      groupDonatorCollector: GroupDonatorCollectorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GroupDonatorCollectorUpdateComponent,
    resolve: {
      groupDonatorCollector: GroupDonatorCollectorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GroupDonatorCollectorUpdateComponent,
    resolve: {
      groupDonatorCollector: GroupDonatorCollectorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(groupDonatorCollectorRoute)],
  exports: [RouterModule],
})
export class GroupDonatorCollectorRoutingModule {}
