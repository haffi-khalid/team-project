import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BudgetPlannerComponent } from './list/budget-planner.component';
import { BudgetPlannerDetailComponent } from './detail/budget-planner-detail.component';
import { BudgetPlannerUpdateComponent } from './update/budget-planner-update.component';
import { BudgetPlannerDeleteDialogComponent } from './delete/budget-planner-delete-dialog.component';
import { BudgetPlannerRoutingModule } from './route/budget-planner-routing.module';

@NgModule({
  imports: [SharedModule, BudgetPlannerRoutingModule],
  declarations: [BudgetPlannerComponent, BudgetPlannerDetailComponent, BudgetPlannerUpdateComponent, BudgetPlannerDeleteDialogComponent],
})
export class BudgetPlannerModule {}
