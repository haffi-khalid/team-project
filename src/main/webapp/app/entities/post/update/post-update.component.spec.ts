import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostFormService } from './post-form.service';
import { PostService } from '../service/post.service';
import { IPost } from '../post.model';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

import { PostUpdateComponent } from './post-update.component';

describe('Post Management Update Component', () => {
  let comp: PostUpdateComponent;
  let fixture: ComponentFixture<PostUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postFormService: PostFormService;
  let postService: PostService;
  let socialFeedService: SocialFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostUpdateComponent],
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
      .overrideTemplate(PostUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postFormService = TestBed.inject(PostFormService);
    postService = TestBed.inject(PostService);
    socialFeedService = TestBed.inject(SocialFeedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SocialFeed query and add missing value', () => {
      const post: IPost = { id: 456 };
      const socialFeed: ISocialFeed = { id: 4350 };
      post.socialFeed = socialFeed;

      const socialFeedCollection: ISocialFeed[] = [{ id: 87667 }];
      jest.spyOn(socialFeedService, 'query').mockReturnValue(of(new HttpResponse({ body: socialFeedCollection })));
      const additionalSocialFeeds = [socialFeed];
      const expectedCollection: ISocialFeed[] = [...additionalSocialFeeds, ...socialFeedCollection];
      jest.spyOn(socialFeedService, 'addSocialFeedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ post });
      comp.ngOnInit();

      expect(socialFeedService.query).toHaveBeenCalled();
      expect(socialFeedService.addSocialFeedToCollectionIfMissing).toHaveBeenCalledWith(
        socialFeedCollection,
        ...additionalSocialFeeds.map(expect.objectContaining)
      );
      expect(comp.socialFeedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const post: IPost = { id: 456 };
      const socialFeed: ISocialFeed = { id: 45957 };
      post.socialFeed = socialFeed;

      activatedRoute.data = of({ post });
      comp.ngOnInit();

      expect(comp.socialFeedsSharedCollection).toContain(socialFeed);
      expect(comp.post).toEqual(post);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postFormService, 'getPost').mockReturnValue(post);
      jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: post }));
      saveSubject.complete();

      // THEN
      expect(postFormService.getPost).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(postService.update).toHaveBeenCalledWith(expect.objectContaining(post));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postFormService, 'getPost').mockReturnValue({ id: null });
      jest.spyOn(postService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: post }));
      saveSubject.complete();

      // THEN
      expect(postFormService.getPost).toHaveBeenCalled();
      expect(postService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
