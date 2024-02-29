import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommentFormService } from './comment-form.service';
import { CommentService } from '../service/comment.service';
import { IComment } from '../comment.model';
import { ICharity } from 'app/entities/charity/charity.model';
import { CharityService } from 'app/entities/charity/service/charity.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Comment Management Update Component', () => {
  let comp: CommentUpdateComponent;
  let fixture: ComponentFixture<CommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentFormService: CommentFormService;
  let commentService: CommentService;
  let charityService: CharityService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommentUpdateComponent],
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
      .overrideTemplate(CommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentFormService = TestBed.inject(CommentFormService);
    commentService = TestBed.inject(CommentService);
    charityService = TestBed.inject(CharityService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Comment query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const commentID: IComment = { id: 60734 };
      comment.commentID = commentID;

      const commentCollection: IComment[] = [{ id: 90269 }];
      jest.spyOn(commentService, 'query').mockReturnValue(of(new HttpResponse({ body: commentCollection })));
      const additionalComments = [commentID];
      const expectedCollection: IComment[] = [...additionalComments, ...commentCollection];
      jest.spyOn(commentService, 'addCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(commentService.query).toHaveBeenCalled();
      expect(commentService.addCommentToCollectionIfMissing).toHaveBeenCalledWith(
        commentCollection,
        ...additionalComments.map(expect.objectContaining)
      );
      expect(comp.commentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Charity query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const charityID: ICharity = { id: 50028 };
      comment.charityID = charityID;

      const charityCollection: ICharity[] = [{ id: 31610 }];
      jest.spyOn(charityService, 'query').mockReturnValue(of(new HttpResponse({ body: charityCollection })));
      const additionalCharities = [charityID];
      const expectedCollection: ICharity[] = [...additionalCharities, ...charityCollection];
      jest.spyOn(charityService, 'addCharityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(charityService.query).toHaveBeenCalled();
      expect(charityService.addCharityToCollectionIfMissing).toHaveBeenCalledWith(
        charityCollection,
        ...additionalCharities.map(expect.objectContaining)
      );
      expect(comp.charitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const userProfile: IUserProfile = { id: 34029 };
      comment.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 44225 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const comment: IComment = { id: 456 };
      const commentID: IComment = { id: 91111 };
      comment.commentID = commentID;
      const charityID: ICharity = { id: 19057 };
      comment.charityID = charityID;
      const userProfile: IUserProfile = { id: 3171 };
      comment.userProfile = userProfile;

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(comp.commentsSharedCollection).toContain(commentID);
      expect(comp.charitiesSharedCollection).toContain(charityID);
      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.comment).toEqual(comment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue(comment);
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentService.update).toHaveBeenCalledWith(expect.objectContaining(comment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue({ id: null });
      jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(commentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareComment', () => {
      it('Should forward to commentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commentService, 'compareComment');
        comp.compareComment(entity, entity2);
        expect(commentService.compareComment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCharity', () => {
      it('Should forward to charityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityService, 'compareCharity');
        comp.compareCharity(entity, entity2);
        expect(charityService.compareCharity).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
