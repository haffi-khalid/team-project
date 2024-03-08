import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VacanciesFormService } from './vacancies-form.service';
import { VacanciesService } from '../service/vacancies.service';
import { IVacancies } from '../vacancies.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { VacanciesUpdateComponent } from './vacancies-update.component';

describe('Vacancies Management Update Component', () => {
  let comp: VacanciesUpdateComponent;
  let fixture: ComponentFixture<VacanciesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacanciesFormService: VacanciesFormService;
  let vacanciesService: VacanciesService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VacanciesUpdateComponent],
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
      .overrideTemplate(VacanciesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacanciesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacanciesFormService = TestBed.inject(VacanciesFormService);
    vacanciesService = TestBed.inject(VacanciesService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityProfile query and add missing value', () => {
      const vacancies: IVacancies = { id: 456 };
      const charityProfile: ICharityProfile = { id: 80602 };
      vacancies.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 38332 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacancies });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vacancies: IVacancies = { id: 456 };
      const charityProfile: ICharityProfile = { id: 31760 };
      vacancies.charityProfile = charityProfile;

      activatedRoute.data = of({ vacancies });
      comp.ngOnInit();

      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.vacancies).toEqual(vacancies);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancies>>();
      const vacancies = { id: 123 };
      jest.spyOn(vacanciesFormService, 'getVacancies').mockReturnValue(vacancies);
      jest.spyOn(vacanciesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacancies }));
      saveSubject.complete();

      // THEN
      expect(vacanciesFormService.getVacancies).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacanciesService.update).toHaveBeenCalledWith(expect.objectContaining(vacancies));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancies>>();
      const vacancies = { id: 123 };
      jest.spyOn(vacanciesFormService, 'getVacancies').mockReturnValue({ id: null });
      jest.spyOn(vacanciesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancies: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacancies }));
      saveSubject.complete();

      // THEN
      expect(vacanciesFormService.getVacancies).toHaveBeenCalled();
      expect(vacanciesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancies>>();
      const vacancies = { id: 123 };
      jest.spyOn(vacanciesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacanciesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCharityProfile', () => {
      it('Should forward to charityProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityProfileService, 'compareCharityProfile');
        comp.compareCharityProfile(entity, entity2);
        expect(charityProfileService.compareCharityProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
