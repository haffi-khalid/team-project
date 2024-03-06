import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBudgetPlanner } from '../budget-planner.model';

@Component({
  selector: 'jhi-budget-planner-detail',
  templateUrl: './budget-planner-detail.component.html',
})
export class BudgetPlannerDetailComponent implements OnInit {
  budgetPlanner: IBudgetPlanner | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budgetPlanner }) => {
      this.budgetPlanner = budgetPlanner;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
