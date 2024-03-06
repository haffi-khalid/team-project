import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityEventFormService } from './charity-event-form.service';
import { CharityEventService } from '../service/charity-event.service';
import { ICharityEvent } from '../charity-event.model';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';

import { CharityEventUpdateComponent } from './charity-event-update.component';

describe('CharityEvent Management Update Component', () => {
  let comp: CharityEventUpdateComponent;
  let fixture: ComponentFixture<CharityEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityEventFormService: CharityEventFormService;
  let charityEventService: CharityEventService;
  let charityAdminService: CharityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityEventUpdateComponent],
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
      .overrideTemplate(CharityEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityEventFormService = TestBed.inject(CharityEventFormService);
    charityEventService = TestBed.inject(CharityEventService);
    charityAdminService = TestBed.inject(CharityAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityAdmin query and add missing value', () => {
      const charityEvent: ICharityEvent = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 61171 };
      charityEvent.charityAdmin = charityAdmin;

      const charityAdminCollection: ICharityAdmin[] = [{ id: 53301 }];
      jest.spyOn(charityAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: charityAdminCollection })));
      const additionalCharityAdmins = [charityAdmin];
      const expectedCollection: ICharityAdmin[] = [...additionalCharityAdmins, ...charityAdminCollection];
      jest.spyOn(charityAdminService, 'addCharityAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      expect(charityAdminService.query).toHaveBeenCalled();
      expect(charityAdminService.addCharityAdminToCollectionIfMissing).toHaveBeenCalledWith(
        charityAdminCollection,
        ...additionalCharityAdmins.map(expect.objectContaining)
      );
      expect(comp.charityAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityEvent: ICharityEvent = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 78001 };
      charityEvent.charityAdmin = charityAdmin;

      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      expect(comp.charityAdminsSharedCollection).toContain(charityAdmin);
      expect(comp.charityEvent).toEqual(charityEvent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventFormService, 'getCharityEvent').mockReturnValue(charityEvent);
      jest.spyOn(charityEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityEvent }));
      saveSubject.complete();

      // THEN
      expect(charityEventFormService.getCharityEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityEventService.update).toHaveBeenCalledWith(expect.objectContaining(charityEvent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventFormService, 'getCharityEvent').mockReturnValue({ id: null });
      jest.spyOn(charityEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityEvent }));
      saveSubject.complete();

      // THEN
      expect(charityEventFormService.getCharityEvent).toHaveBeenCalled();
      expect(charityEventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityEventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCharityAdmin', () => {
      it('Should forward to charityAdminService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityAdminService, 'compareCharityAdmin');
        comp.compareCharityAdmin(entity, entity2);
        expect(charityAdminService.compareCharityAdmin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
