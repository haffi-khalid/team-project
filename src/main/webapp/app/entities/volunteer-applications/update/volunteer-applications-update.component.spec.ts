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
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { VacanciesService } from 'app/entities/vacancies/service/vacancies.service';

import { VolunteerApplicationsUpdateComponent } from './volunteer-applications-update.component';

describe('VolunteerApplications Management Update Component', () => {
  let comp: VolunteerApplicationsUpdateComponent;
  let fixture: ComponentFixture<VolunteerApplicationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let volunteerApplicationsFormService: VolunteerApplicationsFormService;
  let volunteerApplicationsService: VolunteerApplicationsService;
  let charityAdminService: CharityAdminService;
  let charityHubUserService: CharityHubUserService;
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
    charityAdminService = TestBed.inject(CharityAdminService);
    charityHubUserService = TestBed.inject(CharityHubUserService);
    vacanciesService = TestBed.inject(VacanciesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityAdmin query and add missing value', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 1888 };
      volunteerApplications.charityAdmin = charityAdmin;

      const charityAdminCollection: ICharityAdmin[] = [{ id: 72627 }];
      jest.spyOn(charityAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: charityAdminCollection })));
      const additionalCharityAdmins = [charityAdmin];
      const expectedCollection: ICharityAdmin[] = [...additionalCharityAdmins, ...charityAdminCollection];
      jest.spyOn(charityAdminService, 'addCharityAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(charityAdminService.query).toHaveBeenCalled();
      expect(charityAdminService.addCharityAdminToCollectionIfMissing).toHaveBeenCalledWith(
        charityAdminCollection,
        ...additionalCharityAdmins.map(expect.objectContaining)
      );
      expect(comp.charityAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CharityHubUser query and add missing value', () => {
      const volunteerApplications: IVolunteerApplications = { id: 456 };
      const charityHubUser: ICharityHubUser = { id: 34483 };
      volunteerApplications.charityHubUser = charityHubUser;

      const charityHubUserCollection: ICharityHubUser[] = [{ id: 5110 }];
      jest.spyOn(charityHubUserService, 'query').mockReturnValue(of(new HttpResponse({ body: charityHubUserCollection })));
      const additionalCharityHubUsers = [charityHubUser];
      const expectedCollection: ICharityHubUser[] = [...additionalCharityHubUsers, ...charityHubUserCollection];
      jest.spyOn(charityHubUserService, 'addCharityHubUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(charityHubUserService.query).toHaveBeenCalled();
      expect(charityHubUserService.addCharityHubUserToCollectionIfMissing).toHaveBeenCalledWith(
        charityHubUserCollection,
        ...additionalCharityHubUsers.map(expect.objectContaining)
      );
      expect(comp.charityHubUsersSharedCollection).toEqual(expectedCollection);
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
      const charityAdmin: ICharityAdmin = { id: 5301 };
      volunteerApplications.charityAdmin = charityAdmin;
      const charityHubUser: ICharityHubUser = { id: 97106 };
      volunteerApplications.charityHubUser = charityHubUser;
      const vacancies: IVacancies = { id: 84454 };
      volunteerApplications.vacancies = vacancies;

      activatedRoute.data = of({ volunteerApplications });
      comp.ngOnInit();

      expect(comp.charityAdminsSharedCollection).toContain(charityAdmin);
      expect(comp.charityHubUsersSharedCollection).toContain(charityHubUser);
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
    describe('compareCharityAdmin', () => {
      it('Should forward to charityAdminService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityAdminService, 'compareCharityAdmin');
        comp.compareCharityAdmin(entity, entity2);
        expect(charityAdminService.compareCharityAdmin).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCharityHubUser', () => {
      it('Should forward to charityHubUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityHubUserService, 'compareCharityHubUser');
        comp.compareCharityHubUser(entity, entity2);
        expect(charityHubUserService.compareCharityHubUser).toHaveBeenCalledWith(entity, entity2);
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
