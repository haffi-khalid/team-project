import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../budget-planner.test-samples';

import { BudgetPlannerFormService } from './budget-planner-form.service';

describe('BudgetPlanner Form Service', () => {
  let service: BudgetPlannerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetPlannerFormService);
  });

  describe('Service methods', () => {
    describe('createBudgetPlannerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBudgetPlannerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            totalBalance: expect.any(Object),
            upcomingEvents: expect.any(Object),
            targetAmount: expect.any(Object),
            forecastIncome: expect.any(Object),
          })
        );
      });

      it('passing IBudgetPlanner should create a new form with FormGroup', () => {
        const formGroup = service.createBudgetPlannerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            totalBalance: expect.any(Object),
            upcomingEvents: expect.any(Object),
            targetAmount: expect.any(Object),
            forecastIncome: expect.any(Object),
          })
        );
      });
    });

    describe('getBudgetPlanner', () => {
      it('should return NewBudgetPlanner for default BudgetPlanner initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBudgetPlannerFormGroup(sampleWithNewData);

        const budgetPlanner = service.getBudgetPlanner(formGroup) as any;

        expect(budgetPlanner).toMatchObject(sampleWithNewData);
      });

      it('should return NewBudgetPlanner for empty BudgetPlanner initial value', () => {
        const formGroup = service.createBudgetPlannerFormGroup();

        const budgetPlanner = service.getBudgetPlanner(formGroup) as any;

        expect(budgetPlanner).toMatchObject({});
      });

      it('should return IBudgetPlanner', () => {
        const formGroup = service.createBudgetPlannerFormGroup(sampleWithRequiredData);

        const budgetPlanner = service.getBudgetPlanner(formGroup) as any;

        expect(budgetPlanner).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBudgetPlanner should not enable id FormControl', () => {
        const formGroup = service.createBudgetPlannerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBudgetPlanner should disable id FormControl', () => {
        const formGroup = service.createBudgetPlannerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
