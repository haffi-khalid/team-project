import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VolunteerApplicationsComponent } from '../list/volunteer-applications.component';
import { VolunteerApplicationsDetailComponent } from '../detail/volunteer-applications-detail.component';
import { VolunteerApplicationsUpdateComponent } from '../update/volunteer-applications-update.component';
import { VolunteerApplicationsRoutingResolveService } from './volunteer-applications-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const volunteerApplicationsRoute: Routes = [
  {
    path: '',
    component: VolunteerApplicationsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VolunteerApplicationsDetailComponent,
    resolve: {
      volunteerApplications: VolunteerApplicationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VolunteerApplicationsUpdateComponent,
    resolve: {
      volunteerApplications: VolunteerApplicationsRoutingResolveService,
    },
  },
  {
    path: 'new/vacancy/:vacancy',
    component: VolunteerApplicationsUpdateComponent,
    resolve: {
      volunteerApplications: VolunteerApplicationsRoutingResolveService,
    },
  },
  {
    path: ':id/edit',
    component: VolunteerApplicationsUpdateComponent,
    resolve: {
      volunteerApplications: VolunteerApplicationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(volunteerApplicationsRoute)],
  exports: [RouterModule],
})
export class VolunteerApplicationsRoutingModule {}
