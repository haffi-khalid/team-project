import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BudgetPlannerService } from '../service/budget-planner.service';

import { BudgetPlannerComponent } from './budget-planner.component';

describe('BudgetPlanner Management Component', () => {
  let comp: BudgetPlannerComponent;
  let fixture: ComponentFixture<BudgetPlannerComponent>;
  let service: BudgetPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'budget-planner', component: BudgetPlannerComponent }]), HttpClientTestingModule],
      declarations: [BudgetPlannerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BudgetPlannerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BudgetPlannerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BudgetPlannerService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.budgetPlanners?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to budgetPlannerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBudgetPlannerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBudgetPlannerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
