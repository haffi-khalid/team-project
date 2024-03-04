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
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';

import { ApprovedVolunteersUpdateComponent } from './approved-volunteers-update.component';

describe('ApprovedVolunteers Management Update Component', () => {
  let comp: ApprovedVolunteersUpdateComponent;
  let fixture: ComponentFixture<ApprovedVolunteersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let approvedVolunteersFormService: ApprovedVolunteersFormService;
  let approvedVolunteersService: ApprovedVolunteersService;
  let charityHubUserService: CharityHubUserService;
  let charityAdminService: CharityAdminService;

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
    charityHubUserService = TestBed.inject(CharityHubUserService);
    charityAdminService = TestBed.inject(CharityAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityHubUser query and add missing value', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const charityHubUser: ICharityHubUser = { id: 6000 };
      approvedVolunteers.charityHubUser = charityHubUser;

      const charityHubUserCollection: ICharityHubUser[] = [{ id: 65644 }];
      jest.spyOn(charityHubUserService, 'query').mockReturnValue(of(new HttpResponse({ body: charityHubUserCollection })));
      const additionalCharityHubUsers = [charityHubUser];
      const expectedCollection: ICharityHubUser[] = [...additionalCharityHubUsers, ...charityHubUserCollection];
      jest.spyOn(charityHubUserService, 'addCharityHubUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(charityHubUserService.query).toHaveBeenCalled();
      expect(charityHubUserService.addCharityHubUserToCollectionIfMissing).toHaveBeenCalledWith(
        charityHubUserCollection,
        ...additionalCharityHubUsers.map(expect.objectContaining)
      );
      expect(comp.charityHubUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CharityAdmin query and add missing value', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 52976 };
      approvedVolunteers.charityAdmin = charityAdmin;

      const charityAdminCollection: ICharityAdmin[] = [{ id: 39394 }];
      jest.spyOn(charityAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: charityAdminCollection })));
      const additionalCharityAdmins = [charityAdmin];
      const expectedCollection: ICharityAdmin[] = [...additionalCharityAdmins, ...charityAdminCollection];
      jest.spyOn(charityAdminService, 'addCharityAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(charityAdminService.query).toHaveBeenCalled();
      expect(charityAdminService.addCharityAdminToCollectionIfMissing).toHaveBeenCalledWith(
        charityAdminCollection,
        ...additionalCharityAdmins.map(expect.objectContaining)
      );
      expect(comp.charityAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const approvedVolunteers: IApprovedVolunteers = { id: 456 };
      const charityHubUser: ICharityHubUser = { id: 7692 };
      approvedVolunteers.charityHubUser = charityHubUser;
      const charityAdmin: ICharityAdmin = { id: 80262 };
      approvedVolunteers.charityAdmin = charityAdmin;

      activatedRoute.data = of({ approvedVolunteers });
      comp.ngOnInit();

      expect(comp.charityHubUsersSharedCollection).toContain(charityHubUser);
      expect(comp.charityAdminsSharedCollection).toContain(charityAdmin);
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
    describe('compareCharityHubUser', () => {
      it('Should forward to charityHubUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityHubUserService, 'compareCharityHubUser');
        comp.compareCharityHubUser(entity, entity2);
        expect(charityHubUserService.compareCharityHubUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
