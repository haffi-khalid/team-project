import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityProfileFormService } from './charity-profile-form.service';
import { CharityProfileService } from '../service/charity-profile.service';
import { ICharityProfile } from '../charity-profile.model';
import { IBudgetPlanner } from 'app/entities/budget-planner/budget-planner.model';
import { BudgetPlannerService } from 'app/entities/budget-planner/service/budget-planner.service';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

import { CharityProfileUpdateComponent } from './charity-profile-update.component';

describe('CharityProfile Management Update Component', () => {
  let comp: CharityProfileUpdateComponent;
  let fixture: ComponentFixture<CharityProfileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityProfileFormService: CharityProfileFormService;
  let charityProfileService: CharityProfileService;
  let budgetPlannerService: BudgetPlannerService;
  let socialFeedService: SocialFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityProfileUpdateComponent],
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
      .overrideTemplate(CharityProfileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityProfileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityProfileFormService = TestBed.inject(CharityProfileFormService);
    charityProfileService = TestBed.inject(CharityProfileService);
    budgetPlannerService = TestBed.inject(BudgetPlannerService);
    socialFeedService = TestBed.inject(SocialFeedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call budgetPlanner query and add missing value', () => {
      const charityProfile: ICharityProfile = { id: 456 };
      const budgetPlanner: IBudgetPlanner = { id: 57619 };
      charityProfile.budgetPlanner = budgetPlanner;

      const budgetPlannerCollection: IBudgetPlanner[] = [{ id: 36581 }];
      jest.spyOn(budgetPlannerService, 'query').mockReturnValue(of(new HttpResponse({ body: budgetPlannerCollection })));
      const expectedCollection: IBudgetPlanner[] = [budgetPlanner, ...budgetPlannerCollection];
      jest.spyOn(budgetPlannerService, 'addBudgetPlannerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityProfile });
      comp.ngOnInit();

      expect(budgetPlannerService.query).toHaveBeenCalled();
      expect(budgetPlannerService.addBudgetPlannerToCollectionIfMissing).toHaveBeenCalledWith(budgetPlannerCollection, budgetPlanner);
      expect(comp.budgetPlannersCollection).toEqual(expectedCollection);
    });

    it('Should call socialFeed query and add missing value', () => {
      const charityProfile: ICharityProfile = { id: 456 };
      const socialFeed: ISocialFeed = { id: 83074 };
      charityProfile.socialFeed = socialFeed;

      const socialFeedCollection: ISocialFeed[] = [{ id: 14234 }];
      jest.spyOn(socialFeedService, 'query').mockReturnValue(of(new HttpResponse({ body: socialFeedCollection })));
      const expectedCollection: ISocialFeed[] = [socialFeed, ...socialFeedCollection];
      jest.spyOn(socialFeedService, 'addSocialFeedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityProfile });
      comp.ngOnInit();

      expect(socialFeedService.query).toHaveBeenCalled();
      expect(socialFeedService.addSocialFeedToCollectionIfMissing).toHaveBeenCalledWith(socialFeedCollection, socialFeed);
      expect(comp.socialFeedsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityProfile: ICharityProfile = { id: 456 };
      const budgetPlanner: IBudgetPlanner = { id: 85586 };
      charityProfile.budgetPlanner = budgetPlanner;
      const socialFeed: ISocialFeed = { id: 94815 };
      charityProfile.socialFeed = socialFeed;

      activatedRoute.data = of({ charityProfile });
      comp.ngOnInit();

      expect(comp.budgetPlannersCollection).toContain(budgetPlanner);
      expect(comp.socialFeedsCollection).toContain(socialFeed);
      expect(comp.charityProfile).toEqual(charityProfile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityProfile>>();
      const charityProfile = { id: 123 };
      jest.spyOn(charityProfileFormService, 'getCharityProfile').mockReturnValue(charityProfile);
      jest.spyOn(charityProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityProfile }));
      saveSubject.complete();

      // THEN
      expect(charityProfileFormService.getCharityProfile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityProfileService.update).toHaveBeenCalledWith(expect.objectContaining(charityProfile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityProfile>>();
      const charityProfile = { id: 123 };
      jest.spyOn(charityProfileFormService, 'getCharityProfile').mockReturnValue({ id: null });
      jest.spyOn(charityProfileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityProfile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityProfile }));
      saveSubject.complete();

      // THEN
      expect(charityProfileFormService.getCharityProfile).toHaveBeenCalled();
      expect(charityProfileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityProfile>>();
      const charityProfile = { id: 123 };
      jest.spyOn(charityProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityProfileService.update).toHaveBeenCalled();
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

    describe('compareSocialFeed', () => {
      it('Should forward to socialFeedService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(socialFeedService, 'compareSocialFeed');
        comp.compareSocialFeed(entity, entity2);
        expect(socialFeedService.compareSocialFeed).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
