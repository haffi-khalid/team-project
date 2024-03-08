import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBudgetPlanner } from '../budget-planner.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-budget-planner-detail',
  templateUrl: './budget-planner-detail.component.html',
})
export class BudgetPlannerDetailComponent implements OnInit {
  budgetPlanner: IBudgetPlanner | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budgetPlanner }) => {
      this.budgetPlanner = budgetPlanner;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
