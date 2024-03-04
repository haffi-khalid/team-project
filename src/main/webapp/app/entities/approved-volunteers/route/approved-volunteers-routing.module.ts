import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ApprovedVolunteersComponent } from '../list/approved-volunteers.component';
import { ApprovedVolunteersDetailComponent } from '../detail/approved-volunteers-detail.component';
import { ApprovedVolunteersUpdateComponent } from '../update/approved-volunteers-update.component';
import { ApprovedVolunteersRoutingResolveService } from './approved-volunteers-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const approvedVolunteersRoute: Routes = [
  {
    path: '',
    component: ApprovedVolunteersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApprovedVolunteersDetailComponent,
    resolve: {
      approvedVolunteers: ApprovedVolunteersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApprovedVolunteersUpdateComponent,
    resolve: {
      approvedVolunteers: ApprovedVolunteersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApprovedVolunteersUpdateComponent,
    resolve: {
      approvedVolunteers: ApprovedVolunteersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(approvedVolunteersRoute)],
  exports: [RouterModule],
})
export class ApprovedVolunteersRoutingModule {}
