import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ApprovedVolunteersFormService } from './approved-volunteers-form.service';
import { ApprovedVolunteersService } from '../service/approved-volunteers.service';
import { IApprovedVolunteers } from '../approved-volunteers.model';
import { IVolunteerApplications } from 'app/entities/volunteer-applications/volunteer-applications.model';
import { VolunteerApplicationsService } from 'app/entities/volunteer-applications/service/volunteer-applications.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { ApprovedVolunteersUpdateComponent } from './approved-volunteers-update.component';

describe('ApprovedVolunteers Management Update Component', () => {
  let comp: ApprovedVolunteersUpdateComponent;
  let fixture: ComponentFixture<ApprovedVolunteersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let approvedVolunteersFormService: ApprovedVolunteersFormService;
  let approvedVolunteersService: ApprovedVolunteersService;
  let volunteerApplicationsService: VolunteerApplicationsService;
  let userPageService: UserPageService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ApprovedVolunteersUpdateComponent],
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
      .overrideTemplate(ApprovedVolunteersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApprovedVolunteersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    approvedVolunteersFormService = TestBed.inject(ApprovedVolunteersFormService);
    approvedVolunteersService = TestBed.inject(ApprovedVolunteersService);
    volunteerApplicationsService = TestBed.inject(VolunteerApplicationsService);
    userPageService = TestBed.inject(UserPageService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call volunteerApplications query and add missing value', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const volunteerApplications: IVolunteerApplications = { id: 44483 };
      approvedVolunteers.volunteerApplications = volunteerApplications;

      const volunteerApplicationsCollection: IVolunteerApplications[] = [{ id: 12422 }];
      jest.spyOn(volunteerApplicationsService, 'query').mockReturnValue(of(new HttpResponse({ body: volunteerApplicationsCollection })));
      const expectedCollection: IVolunteerApplications[] = [volunteerApplications, ...volunteerApplicationsCollection];
      jest.spyOn(volunteerApplicationsService, 'addVolunteerApplicationsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(volunteerApplicationsService.query).toHaveBeenCalled();
      expect(volunteerApplicationsService.addVolunteerApplicationsToCollectionIfMissing).toHaveBeenCalledWith(
        volunteerApplicationsCollection,
        volunteerApplications
      );
      expect(comp.volunteerApplicationsCollection).toEqual(expectedCollection);
    });

    it('Should call UserPage query and add missing value', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const userPage: IUserPage = { id: 23505 };
      approvedVolunteers.userPage = userPage;

      const userPageCollection: IUserPage[] = [{ id: 84113 }];
      jest.spyOn(userPageService, 'query').mockReturnValue(of(new HttpResponse({ body: userPageCollection })));
      const additionalUserPages = [userPage];
      const expectedCollection: IUserPage[] = [...additionalUserPages, ...userPageCollection];
      jest.spyOn(userPageService, 'addUserPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(userPageService.query).toHaveBeenCalled();
      expect(userPageService.addUserPageToCollectionIfMissing).toHaveBeenCalledWith(
        userPageCollection,
        ...additionalUserPages.map(expect.objectContaining)
      );
      expect(comp.userPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CharityProfile query and add missing value', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const charityProfile: ICharityProfile = { id: 71932 };
      approvedVolunteers.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 93075 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const volunteerApplications: IVolunteerApplications = { id: 66171 };
      approvedVolunteers.volunteerApplications = volunteerApplications;
      const userPage: IUserPage = { id: 34590 };
      approvedVolunteers.userPage = userPage;
      const charityProfile: ICharityProfile = { id: 56150 };
      approvedVolunteers.charityProfile = charityProfile;

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(comp.volunteerApplicationsCollection).toContain(volunteerApplications);
      expect(comp.userPagesSharedCollection).toContain(userPage);
      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.approvedVolunteers).toEqual(approvedVolunteers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApprovedVolunteers>>();
      const approvedVolunteers = { id: 123 };
      jest.spyOn(approvedVolunteersFormService, 'getApprovedVolunteers').mockReturnValue(approvedVolunteers);
      jest.spyOn(approvedVolunteersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: approvedVolunteers }));
      saveSubject.complete();

      // THEN
      expect(approvedVolunteersFormService.getApprovedVolunteers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(approvedVolunteersService.update).toHaveBeenCalledWith(expect.objectContaining(approvedVolunteers));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApprovedVolunteers>>();
      const approvedVolunteers = { id: 123 };
      jest.spyOn(approvedVolunteersFormService, 'getApprovedVolunteers').mockReturnValue({ id: null });
      jest.spyOn(approvedVolunteersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ approvedVolunteers: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: approvedVolunteers }));
      saveSubject.complete();

      // THEN
      expect(approvedVolunteersFormService.getApprovedVolunteers).toHaveBeenCalled();
      expect(approvedVolunteersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApprovedVolunteers>>();
      const approvedVolunteers = { id: 123 };
      jest.spyOn(approvedVolunteersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(approvedVolunteersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVolunteerApplications', () => {
      it('Should forward to volunteerApplicationsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(volunteerApplicationsService, 'compareVolunteerApplications');
        comp.compareVolunteerApplications(entity, entity2);
        expect(volunteerApplicationsService.compareVolunteerApplications).toHaveBeenCalledWith(entity, entity2);
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
