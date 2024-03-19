import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VolunteerApplicationsFormService } from './volunteer-applications-form.service';
import { VolunteerApplicationsService } from '../service/volunteer-applications.service';
import { IVolunteerApplications } from '../volunteer-applications.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { VacanciesService } from 'app/entities/vacancies/service/vacancies.service';

import { VolunteerApplicationsUpdateComponent } from './volunteer-applications-update.component';

describe('VolunteerApplications Management Update Component', () => {
  let comp: VolunteerApplicationsUpdateComponent;
  let fixture: ComponentFixture<VolunteerApplicationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let volunteerApplicationsFormService: VolunteerApplicationsFormService;
  let volunteerApplicationsService: VolunteerApplicationsService;
  let charityProfileService: CharityProfileService;
  let userPageService: UserPageService;
  let vacanciesService: VacanciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VolunteerApplicationsUpdateComponent],
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
      .overrideTemplate(VolunteerApplicationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VolunteerApplicationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    volunteerApplicationsFormService = TestBed.inject(VolunteerApplicationsFormService);
    volunteerApplicationsService = TestBed.inject(VolunteerApplicationsService);
    charityProfileService = TestBed.inject(CharityProfileService);
    userPageService = TestBed.inject(UserPageService);
    vacanciesService = TestBed.inject(VacanciesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityProfile query and add missing value', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const charityProfile: ICharityProfile = { id: 77112 };
      volunteerApplications.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 48938 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserPage query and add missing value', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const userPage: IUserPage = { id: 61435 };
      volunteerApplications.userPage = userPage;

      const userPageCollection: IUserPage[] = [{ id: 80017 }];
      jest.spyOn(userPageService, 'query').mockReturnValue(of(new HttpResponse({ body: userPageCollection })));
      const additionalUserPages = [userPage];
      const expectedCollection: IUserPage[] = [...additionalUserPages, ...userPageCollection];
      jest.spyOn(userPageService, 'addUserPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(userPageService.query).toHaveBeenCalled();
      expect(userPageService.addUserPageToCollectionIfMissing).toHaveBeenCalledWith(
        userPageCollection,
        ...additionalUserPages.map(expect.objectContaining)
      );
      expect(comp.userPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Vacancies query and add missing value', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const vacancies: IVacancies = { id: 41560 };
      volunteerApplications.vacancies = vacancies;

      const vacanciesCollection: IVacancies[] = [{ id: 82861 }];
      jest.spyOn(vacanciesService, 'query').mockReturnValue(of(new HttpResponse({ body: vacanciesCollection })));
      const additionalVacancies = [vacancies];
      const expectedCollection: IVacancies[] = [...additionalVacancies, ...vacanciesCollection];
      jest.spyOn(vacanciesService, 'addVacanciesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(vacanciesService.query).toHaveBeenCalled();
      expect(vacanciesService.addVacanciesToCollectionIfMissing).toHaveBeenCalledWith(
        vacanciesCollection,
        ...additionalVacancies.map(expect.objectContaining)
      );
      expect(comp.vacanciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const charityProfile: ICharityProfile = { id: 14184 };
      volunteerApplications.charityProfile = charityProfile;
      const userPage: IUserPage = { id: 25737 };
      volunteerApplications.userPage = userPage;
      const vacancies: IVacancies = { id: 84454 };
      volunteerApplications.vacancies = vacancies;

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.userPagesSharedCollection).toContain(userPage);
      expect(comp.vacanciesSharedCollection).toContain(vacancies);
      expect(comp.volunteerApplications).toEqual(volunteerApplications);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerApplications>>();
      const volunteerApplications = { id: 123 };
      jest.spyOn(volunteerApplicationsFormService, 'getVolunteerApplications').mockReturnValue(volunteerApplications);
      jest.spyOn(volunteerApplicationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: volunteerApplications }));
      saveSubject.complete();

      // THEN
      expect(volunteerApplicationsFormService.getVolunteerApplications).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(volunteerApplicationsService.update).toHaveBeenCalledWith(expect.objectContaining(volunteerApplications));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerApplications>>();
      const volunteerApplications = { id: 123 };
      jest.spyOn(volunteerApplicationsFormService, 'getVolunteerApplications').mockReturnValue({ id: null });
      jest.spyOn(volunteerApplicationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerApplications: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: volunteerApplications }));
      saveSubject.complete();

      // THEN
      expect(volunteerApplicationsFormService.getVolunteerApplications).toHaveBeenCalled();
      expect(volunteerApplicationsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerApplications>>();
      const volunteerApplications = { id: 123 };
      jest.spyOn(volunteerApplicationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(volunteerApplicationsService.update).toHaveBeenCalled();
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

    describe('compareUserPage', () => {
      it('Should forward to userPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userPageService, 'compareUserPage');
        comp.compareUserPage(entity, entity2);
        expect(userPageService.compareUserPage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVacancies', () => {
      it('Should forward to vacanciesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vacanciesService, 'compareVacancies');
        comp.compareVacancies(entity, entity2);
        expect(vacanciesService.compareVacancies).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
