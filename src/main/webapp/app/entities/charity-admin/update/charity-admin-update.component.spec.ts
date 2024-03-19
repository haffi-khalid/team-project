import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityAdminFormService } from './charity-admin-form.service';
import { CharityAdminService } from '../service/charity-admin.service';
import { ICharityAdmin } from '../charity-admin.model';

import { CharityAdminUpdateComponent } from './charity-admin-update.component';

describe('CharityAdmin Management Update Component', () => {
  let comp: CharityAdminUpdateComponent;
  let fixture: ComponentFixture<CharityAdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityAdminFormService: CharityAdminFormService;
  let charityAdminService: CharityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityAdminUpdateComponent],
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
      .overrideTemplate(CharityAdminUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityAdminUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityAdminFormService = TestBed.inject(CharityAdminFormService);
    charityAdminService = TestBed.inject(CharityAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const charityAdmin: ICharityAdmin = { id: 456 };

      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      expect(comp.charityAdmin).toEqual(charityAdmin);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityAdmin>>();
      const charityAdmin = { id: 123 };
      jest.spyOn(charityAdminFormService, 'getCharityAdmin').mockReturnValue(charityAdmin);
      jest.spyOn(charityAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityAdmin }));
      saveSubject.complete();

      // THEN
      expect(charityAdminFormService.getCharityAdmin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityAdminService.update).toHaveBeenCalledWith(expect.objectContaining(charityAdmin));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityAdmin>>();
      const charityAdmin = { id: 123 };
      jest.spyOn(charityAdminFormService, 'getCharityAdmin').mockReturnValue({ id: null });
      jest.spyOn(charityAdminService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityAdmin: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityAdmin }));
      saveSubject.complete();

      // THEN
      expect(charityAdminFormService.getCharityAdmin).toHaveBeenCalled();
      expect(charityAdminService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityAdmin>>();
      const charityAdmin = { id: 123 };
      jest.spyOn(charityAdminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityAdminService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
