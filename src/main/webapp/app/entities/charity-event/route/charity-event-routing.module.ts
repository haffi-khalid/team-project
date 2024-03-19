import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityEventComponent } from '../list/charity-event.component';
import { CharityEventDetailComponent } from '../detail/charity-event-detail.component';
import { CharityEventUpdateComponent } from '../update/charity-event-update.component';
import { CharityEventRoutingResolveService } from './charity-event-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityEventRoute: Routes = [
  {
    path: '',
    component: CharityEventComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityEventDetailComponent,
    resolve: {
      charityEvent: CharityEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityEventUpdateComponent,
    resolve: {
      charityEvent: CharityEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityEventUpdateComponent,
    resolve: {
      charityEvent: CharityEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityEventRoute)],
  exports: [RouterModule],
})
export class CharityEventRoutingModule {}
