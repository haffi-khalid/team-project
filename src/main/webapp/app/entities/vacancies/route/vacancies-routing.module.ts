import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VacanciesComponent } from '../list/vacancies.component';
import { VacanciesDetailComponent } from '../detail/vacancies-detail.component';
import { VacanciesUpdateComponent } from '../update/vacancies-update.component';
import { VacanciesRoutingResolveService } from './vacancies-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const vacanciesRoute: Routes = [
  {
    path: '',
    component: VacanciesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
  },
  {
    path: ':id/view',
    component: VacanciesDetailComponent,
    resolve: {
      vacancies: VacanciesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VacanciesUpdateComponent,
    resolve: {
      vacancies: VacanciesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VacanciesUpdateComponent,
    resolve: {
      vacancies: VacanciesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vacanciesRoute)],
  exports: [RouterModule],
})
export class VacanciesRoutingModule {}
