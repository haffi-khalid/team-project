import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MediaFormService } from './media-form.service';
import { MediaService } from '../service/media.service';
import { IMedia } from '../media.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { MediaUpdateComponent } from './media-update.component';

describe('Media Management Update Component', () => {
  let comp: MediaUpdateComponent;
  let fixture: ComponentFixture<MediaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mediaFormService: MediaFormService;
  let mediaService: MediaService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MediaUpdateComponent],
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
      .overrideTemplate(MediaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MediaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mediaFormService = TestBed.inject(MediaFormService);
    mediaService = TestBed.inject(MediaService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const media: IMedia = { id: 456 };
      const post: IPost = { id: 66025 };
      media.post = post;

      const postCollection: IPost[] = [{ id: 88800 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ media });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const media: IMedia = { id: 456 };
      const post: IPost = { id: 32033 };
      media.post = post;

      activatedRoute.data = of({ media });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.media).toEqual(media);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 123 };
      jest.spyOn(mediaFormService, 'getMedia').mockReturnValue(media);
      jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: media }));
      saveSubject.complete();

      // THEN
      expect(mediaFormService.getMedia).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mediaService.update).toHaveBeenCalledWith(expect.objectContaining(media));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 123 };
      jest.spyOn(mediaFormService, 'getMedia').mockReturnValue({ id: null });
      jest.spyOn(mediaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: media }));
      saveSubject.complete();

      // THEN
      expect(mediaFormService.getMedia).toHaveBeenCalled();
      expect(mediaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 123 };
      jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mediaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
