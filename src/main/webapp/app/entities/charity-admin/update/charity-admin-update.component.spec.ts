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
import { IBudgetPlanner } from 'app/entities/budget-planner/budget-planner.model';
import { BudgetPlannerService } from 'app/entities/budget-planner/service/budget-planner.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { CharityAdminUpdateComponent } from './charity-admin-update.component';

describe('CharityAdmin Management Update Component', () => {
  let comp: CharityAdminUpdateComponent;
  let fixture: ComponentFixture<CharityAdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityAdminFormService: CharityAdminFormService;
  let charityAdminService: CharityAdminService;
  let budgetPlannerService: BudgetPlannerService;
  let charityProfileService: CharityProfileService;

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
    budgetPlannerService = TestBed.inject(BudgetPlannerService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call budgetPlanner query and add missing value', () => {
      const charityAdmin: ICharityAdmin = { id: 456 };
      const budgetPlanner: IBudgetPlanner = { id: 81336 };
      charityAdmin.budgetPlanner = budgetPlanner;

      const budgetPlannerCollection: IBudgetPlanner[] = [{ id: 89429 }];
      jest.spyOn(budgetPlannerService, 'query').mockReturnValue(of(new HttpResponse({ body: budgetPlannerCollection })));
      const expectedCollection: IBudgetPlanner[] = [budgetPlanner, ...budgetPlannerCollection];
      jest.spyOn(budgetPlannerService, 'addBudgetPlannerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      expect(budgetPlannerService.query).toHaveBeenCalled();
      expect(budgetPlannerService.addBudgetPlannerToCollectionIfMissing).toHaveBeenCalledWith(budgetPlannerCollection, budgetPlanner);
      expect(comp.budgetPlannersCollection).toEqual(expectedCollection);
    });

    it('Should call CharityProfile query and add missing value', () => {
      const charityAdmin: ICharityAdmin = { id: 456 };
      const charityProfile: ICharityProfile = { id: 10011 };
      charityAdmin.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 74589 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityAdmin: ICharityAdmin = { id: 456 };
      const budgetPlanner: IBudgetPlanner = { id: 70999 };
      charityAdmin.budgetPlanner = budgetPlanner;
      const charityProfile: ICharityProfile = { id: 49669 };
      charityAdmin.charityProfile = charityProfile;

      activatedRoute.data = of({ charityAdmin });
      comp.ngOnInit();

      expect(comp.budgetPlannersCollection).toContain(budgetPlanner);
      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
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

  describe('Compare relationships', () => {
    describe('compareBudgetPlanner', () => {
      it('Should forward to budgetPlannerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(budgetPlannerService, 'compareBudgetPlanner');
        comp.compareBudgetPlanner(entity, entity2);
        expect(budgetPlannerService.compareBudgetPlanner).toHaveBeenCalledWith(entity, entity2);
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
