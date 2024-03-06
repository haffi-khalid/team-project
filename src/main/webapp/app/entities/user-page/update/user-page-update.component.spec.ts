import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserPageFormService } from './user-page-form.service';
import { UserPageService } from '../service/user-page.service';
import { IUserPage } from '../user-page.model';

import { UserPageUpdateComponent } from './user-page-update.component';

describe('UserPage Management Update Component', () => {
  let comp: UserPageUpdateComponent;
  let fixture: ComponentFixture<UserPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPageFormService: UserPageFormService;
  let userPageService: UserPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserPageUpdateComponent],
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
      .overrideTemplate(UserPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPageFormService = TestBed.inject(UserPageFormService);
    userPageService = TestBed.inject(UserPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userPage: IUserPage = { id: 456 };

      activatedRoute.data = of({ userPage });
      comp.ngOnInit();

      expect(comp.userPage).toEqual(userPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPage>>();
      const userPage = { id: 123 };
      jest.spyOn(userPageFormService, 'getUserPage').mockReturnValue(userPage);
      jest.spyOn(userPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPage }));
      saveSubject.complete();

      // THEN
      expect(userPageFormService.getUserPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPageService.update).toHaveBeenCalledWith(expect.objectContaining(userPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPage>>();
      const userPage = { id: 123 };
      jest.spyOn(userPageFormService, 'getUserPage').mockReturnValue({ id: null });
      jest.spyOn(userPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPage }));
      saveSubject.complete();

      // THEN
      expect(userPageFormService.getUserPage).toHaveBeenCalled();
      expect(userPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPage>>();
      const userPage = { id: 123 };
      jest.spyOn(userPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
