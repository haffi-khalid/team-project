import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BudgetPlannerComponent } from '../list/budget-planner.component';
import { BudgetPlannerDetailComponent } from '../detail/budget-planner-detail.component';
import { BudgetPlannerUpdateComponent } from '../update/budget-planner-update.component';
import { BudgetPlannerRoutingResolveService } from './budget-planner-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const budgetPlannerRoute: Routes = [
  {
    path: '',
    component: BudgetPlannerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BudgetPlannerDetailComponent,
    resolve: {
      budgetPlanner: BudgetPlannerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BudgetPlannerUpdateComponent,
    resolve: {
      budgetPlanner: BudgetPlannerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BudgetPlannerUpdateComponent,
    resolve: {
      budgetPlanner: BudgetPlannerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(budgetPlannerRoute)],
  exports: [RouterModule],
})
export class BudgetPlannerRoutingModule {}
