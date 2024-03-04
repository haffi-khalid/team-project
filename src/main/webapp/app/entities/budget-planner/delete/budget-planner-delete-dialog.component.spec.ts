jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BudgetPlannerService } from '../service/budget-planner.service';

import { BudgetPlannerDeleteDialogComponent } from './budget-planner-delete-dialog.component';

describe('BudgetPlanner Management Delete Component', () => {
  let comp: BudgetPlannerDeleteDialogComponent;
  let fixture: ComponentFixture<BudgetPlannerDeleteDialogComponent>;
  let service: BudgetPlannerService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BudgetPlannerDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(BudgetPlannerDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BudgetPlannerDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BudgetPlannerService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
