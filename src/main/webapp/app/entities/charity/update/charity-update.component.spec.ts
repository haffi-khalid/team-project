import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityFormService } from './charity-form.service';
import { CharityService } from '../service/charity.service';
import { ICharity } from '../charity.model';

import { CharityUpdateComponent } from './charity-update.component';

describe('Charity Management Update Component', () => {
  let comp: CharityUpdateComponent;
  let fixture: ComponentFixture<CharityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityFormService: CharityFormService;
  let charityService: CharityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityUpdateComponent],
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
      .overrideTemplate(CharityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityFormService = TestBed.inject(CharityFormService);
    charityService = TestBed.inject(CharityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const charity: ICharity = { id: 456 };

      activatedRoute.data = of({ charity });
      comp.ngOnInit();

      expect(comp.charity).toEqual(charity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharity>>();
      const charity = { id: 123 };
      jest.spyOn(charityFormService, 'getCharity').mockReturnValue(charity);
      jest.spyOn(charityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charity }));
      saveSubject.complete();

      // THEN
      expect(charityFormService.getCharity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityService.update).toHaveBeenCalledWith(expect.objectContaining(charity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharity>>();
      const charity = { id: 123 };
      jest.spyOn(charityFormService, 'getCharity').mockReturnValue({ id: null });
      jest.spyOn(charityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charity }));
      saveSubject.complete();

      // THEN
      expect(charityFormService.getCharity).toHaveBeenCalled();
      expect(charityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharity>>();
      const charity = { id: 123 };
      jest.spyOn(charityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
