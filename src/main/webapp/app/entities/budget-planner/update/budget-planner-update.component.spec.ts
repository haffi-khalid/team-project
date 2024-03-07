import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BudgetPlannerFormService } from './budget-planner-form.service';
import { BudgetPlannerService } from '../service/budget-planner.service';
import { IBudgetPlanner } from '../budget-planner.model';

import { BudgetPlannerUpdateComponent } from './budget-planner-update.component';

describe('BudgetPlanner Management Update Component', () => {
  let comp: BudgetPlannerUpdateComponent;
  let fixture: ComponentFixture<BudgetPlannerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let budgetPlannerFormService: BudgetPlannerFormService;
  let budgetPlannerService: BudgetPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BudgetPlannerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BudgetPlannerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BudgetPlannerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    budgetPlannerFormService = TestBed.inject(BudgetPlannerFormService);
    budgetPlannerService = TestBed.inject(BudgetPlannerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const budgetPlanner: IBudgetPlanner = { id: 456 };

      activatedRoute.data = of({ budgetPlanner });
      comp.ngOnInit();

      expect(comp.budgetPlanner).toEqual(budgetPlanner);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudgetPlanner>>();
      const budgetPlanner = { id: 123 };
      jest.spyOn(budgetPlannerFormService, 'getBudgetPlanner').mockReturnValue(budgetPlanner);
      jest.spyOn(budgetPlannerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budgetPlanner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: budgetPlanner }));
      saveSubject.complete();

      // THEN
      expect(budgetPlannerFormService.getBudgetPlanner).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(budgetPlannerService.update).toHaveBeenCalledWith(expect.objectContaining(budgetPlanner));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudgetPlanner>>();
      const budgetPlanner = { id: 123 };
      jest.spyOn(budgetPlannerFormService, 'getBudgetPlanner').mockReturnValue({ id: null });
      jest.spyOn(budgetPlannerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budgetPlanner: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: budgetPlanner }));
      saveSubject.complete();

      // THEN
      expect(budgetPlannerFormService.getBudgetPlanner).toHaveBeenCalled();
      expect(budgetPlannerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBudgetPlanner>>();
      const budgetPlanner = { id: 123 };
      jest.spyOn(budgetPlannerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ budgetPlanner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(budgetPlannerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
