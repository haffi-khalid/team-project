import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BudgetPlannerFormService, BudgetPlannerFormGroup } from './budget-planner-form.service';
import { IBudgetPlanner } from '../budget-planner.model';
import { BudgetPlannerService } from '../service/budget-planner.service';

@Component({
  selector: 'jhi-budget-planner-update',
  templateUrl: './budget-planner-update.component.html',
})
export class BudgetPlannerUpdateComponent implements OnInit {
  isSaving = false;
  budgetPlanner: IBudgetPlanner | null = null;

  editForm: BudgetPlannerFormGroup = this.budgetPlannerFormService.createBudgetPlannerFormGroup();

  constructor(
    protected budgetPlannerService: BudgetPlannerService,
    protected budgetPlannerFormService: BudgetPlannerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budgetPlanner }) => {
      this.budgetPlanner = budgetPlanner;
      if (budgetPlanner) {
        this.updateForm(budgetPlanner);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const budgetPlanner = this.budgetPlannerFormService.getBudgetPlanner(this.editForm);
    if (budgetPlanner.id !== null) {
      this.subscribeToSaveResponse(this.budgetPlannerService.update(budgetPlanner));
    } else {
      this.subscribeToSaveResponse(this.budgetPlannerService.create(budgetPlanner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBudgetPlanner>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(budgetPlanner: IBudgetPlanner): void {
    this.budgetPlanner = budgetPlanner;
    this.budgetPlannerFormService.resetForm(this.editForm, budgetPlanner);
  }
}
