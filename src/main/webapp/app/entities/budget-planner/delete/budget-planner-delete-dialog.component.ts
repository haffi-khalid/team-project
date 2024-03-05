import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudgetPlanner } from '../budget-planner.model';
import { BudgetPlannerService } from '../service/budget-planner.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './budget-planner-delete-dialog.component.html',
})
export class BudgetPlannerDeleteDialogComponent {
  budgetPlanner?: IBudgetPlanner;

  constructor(protected budgetPlannerService: BudgetPlannerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.budgetPlannerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
