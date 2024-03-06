import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BudgetPlannerDetailComponent } from './budget-planner-detail.component';

describe('BudgetPlanner Management Detail Component', () => {
  let comp: BudgetPlannerDetailComponent;
  let fixture: ComponentFixture<BudgetPlannerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetPlannerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ budgetPlanner: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BudgetPlannerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BudgetPlannerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load budgetPlanner on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.budgetPlanner).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
