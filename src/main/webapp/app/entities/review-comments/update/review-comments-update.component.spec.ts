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
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { ReviewCommentsUpdateComponent } from './review-comments-update.component';

describe('ReviewComments Management Update Component', () => {
  let comp: ReviewCommentsUpdateComponent;
  let fixture: ComponentFixture<ReviewCommentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reviewCommentsFormService: ReviewCommentsFormService;
  let reviewCommentsService: ReviewCommentsService;
  let userPageService: UserPageService;
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
    userPageService = TestBed.inject(UserPageService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserPage query and add missing value', () => {
      const reviewComments: IReviewComments = { id: 456 };
      const userPage: IUserPage = { id: 88824 };
      reviewComments.userPage = userPage;

      const userPageCollection: IUserPage[] = [{ id: 82929 }];
      jest.spyOn(userPageService, 'query').mockReturnValue(of(new HttpResponse({ body: userPageCollection })));
      const additionalUserPages = [userPage];
      const expectedCollection: IUserPage[] = [...additionalUserPages, ...userPageCollection];
      jest.spyOn(userPageService, 'addUserPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      expect(userPageService.query).toHaveBeenCalled();
      expect(userPageService.addUserPageToCollectionIfMissing).toHaveBeenCalledWith(
        userPageCollection,
        ...additionalUserPages.map(expect.objectContaining)
      );
      expect(comp.userPagesSharedCollection).toEqual(expectedCollection);
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
      const userPage: IUserPage = { id: 7470 };
      reviewComments.userPage = userPage;
      const charityProfile: ICharityProfile = { id: 94444 };
      reviewComments.charityProfile = charityProfile;

      activatedRoute.data = of({ reviewComments });
      comp.ngOnInit();

      expect(comp.userPagesSharedCollection).toContain(userPage);
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
