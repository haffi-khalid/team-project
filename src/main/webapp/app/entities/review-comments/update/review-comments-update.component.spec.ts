import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReviewCommentsFormService } from './review-comments-form.service';
import { ReviewCommentsService } from '../service/review-comments.service';
import { IReviewComments } from '../review-comments.model';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { ReviewCommentsUpdateComponent } from './review-comments-update.component';

describe('ReviewComments Management Update Component', () => {
  let comp: ReviewCommentsUpdateComponent;
  let fixture: ComponentFixture<ReviewCommentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reviewCommentsFormService: ReviewCommentsFormService;
  let reviewCommentsService: ReviewCommentsService;
  let charityHubUserService: CharityHubUserService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReviewCommentsUpdateComponent],
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
      .overrideTemplate(ReviewCommentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReviewCommentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reviewCommentsFormService = TestBed.inject(ReviewCommentsFormService);
    reviewCommentsService = TestBed.inject(ReviewCommentsService);
    charityHubUserService = TestBed.inject(CharityHubUserService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityHubUser query and add missing value', () => {
      const reviewComments: IReviewComments = { id: 456 };
      const charityHubUser: ICharityHubUser = { id: 58110 };
      reviewComments.charityHubUser = charityHubUser;

      const charityHubUserCollection: ICharityHubUser[] = [{ id: 50924 }];
      jest.spyOn(charityHubUserService, 'query').mockReturnValue(of(new HttpResponse({ body: charityHubUserCollection })));
      const additionalCharityHubUsers = [charityHubUser];
      const expectedCollection: ICharityHubUser[] = [...additionalCharityHubUsers, ...charityHubUserCollection];
      jest.spyOn(charityHubUserService, 'addCharityHubUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      expect(charityHubUserService.query).toHaveBeenCalled();
      expect(charityHubUserService.addCharityHubUserToCollectionIfMissing).toHaveBeenCalledWith(
        charityHubUserCollection,
        ...additionalCharityHubUsers.map(expect.objectContaining)
      );
      expect(comp.charityHubUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CharityProfile query and add missing value', () => {
      const reviewComments: IReviewComments = { id: 456 };
      const charityProfile: ICharityProfile = { id: 62815 };
      reviewComments.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 15456 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reviewComments: IReviewComments = { id: 456 };
      const charityHubUser: ICharityHubUser = { id: 2477 };
      reviewComments.charityHubUser = charityHubUser;
      const charityProfile: ICharityProfile = { id: 94444 };
      reviewComments.charityProfile = charityProfile;

      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      expect(comp.charityHubUsersSharedCollection).toContain(charityHubUser);
      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.reviewComments).toEqual(reviewComments);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReviewComments>>();
      const reviewComments = { id: 123 };
      jest.spyOn(reviewCommentsFormService, 'getReviewComments').mockReturnValue(reviewComments);
      jest.spyOn(reviewCommentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reviewComments }));
      saveSubject.complete();

      // THEN
      expect(reviewCommentsFormService.getReviewComments).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reviewCommentsService.update).toHaveBeenCalledWith(expect.objectContaining(reviewComments));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReviewComments>>();
      const reviewComments = { id: 123 };
      jest.spyOn(reviewCommentsFormService, 'getReviewComments').mockReturnValue({ id: null });
      jest.spyOn(reviewCommentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reviewComments: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reviewComments }));
      saveSubject.complete();

      // THEN
      expect(reviewCommentsFormService.getReviewComments).toHaveBeenCalled();
      expect(reviewCommentsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReviewComments>>();
      const reviewComments = { id: 123 };
      jest.spyOn(reviewCommentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reviewCommentsService.update).toHaveBeenCalled();
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
