import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBudgetPlanner, NewBudgetPlanner } from '../budget-planner.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBudgetPlanner for edit and NewBudgetPlannerFormGroupInput for create.
 */
type BudgetPlannerFormGroupInput = IBudgetPlanner | PartialWithRequiredKeyOf<NewBudgetPlanner>;

type BudgetPlannerFormDefaults = Pick<NewBudgetPlanner, 'id'>;

type BudgetPlannerFormGroupContent = {
  id: FormControl<IBudgetPlanner['id'] | NewBudgetPlanner['id']>;
  charityName: FormControl<IBudgetPlanner['charityName']>;
  totalBalance: FormControl<IBudgetPlanner['totalBalance']>;
  upcomingEvents: FormControl<IBudgetPlanner['upcomingEvents']>;
  targetAmount: FormControl<IBudgetPlanner['targetAmount']>;
  forecastIncome: FormControl<IBudgetPlanner['forecastIncome']>;
};

export type BudgetPlannerFormGroup = FormGroup<BudgetPlannerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BudgetPlannerFormService {
  createBudgetPlannerFormGroup(budgetPlanner: BudgetPlannerFormGroupInput = { id: null }): BudgetPlannerFormGroup {
    const budgetPlannerRawValue = {
      ...this.getFormDefaults(),
      ...budgetPlanner,
    };
    return new FormGroup<BudgetPlannerFormGroupContent>({
      id: new FormControl(
        { value: budgetPlannerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      charityName: new FormControl(budgetPlannerRawValue.charityName),
      totalBalance: new FormControl(budgetPlannerRawValue.totalBalance),
      upcomingEvents: new FormControl(budgetPlannerRawValue.upcomingEvents),
      targetAmount: new FormControl(budgetPlannerRawValue.targetAmount),
      forecastIncome: new FormControl(budgetPlannerRawValue.forecastIncome),
    });
  }

  getBudgetPlanner(form: BudgetPlannerFormGroup): IBudgetPlanner | NewBudgetPlanner {
    return form.getRawValue() as IBudgetPlanner | NewBudgetPlanner;
  }

  resetForm(form: BudgetPlannerFormGroup, budgetPlanner: BudgetPlannerFormGroupInput): void {
    const budgetPlannerRawValue = { ...this.getFormDefaults(), ...budgetPlanner };
    form.reset(
      {
        ...budgetPlannerRawValue,
        id: { value: budgetPlannerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BudgetPlannerFormDefaults {
    return {
      id: null,
    };
  }
}
