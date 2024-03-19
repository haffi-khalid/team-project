import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityHubUserFormService } from './charity-hub-user-form.service';
import { CharityHubUserService } from '../service/charity-hub-user.service';
import { ICharityHubUser } from '../charity-hub-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { IAuthentication } from 'app/entities/authentication/authentication.model';
import { AuthenticationService } from 'app/entities/authentication/service/authentication.service';

import { CharityHubUserUpdateComponent } from './charity-hub-user-update.component';

describe('CharityHubUser Management Update Component', () => {
  let comp: CharityHubUserUpdateComponent;
  let fixture: ComponentFixture<CharityHubUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityHubUserFormService: CharityHubUserFormService;
  let charityHubUserService: CharityHubUserService;
  let userService: UserService;
  let userPageService: UserPageService;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityHubUserUpdateComponent],
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
      .overrideTemplate(CharityHubUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityHubUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityHubUserFormService = TestBed.inject(CharityHubUserFormService);
    charityHubUserService = TestBed.inject(CharityHubUserService);
    userService = TestBed.inject(UserService);
    userPageService = TestBed.inject(UserPageService);
    authenticationService = TestBed.inject(AuthenticationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const charityHubUser: ICharityHubUser = { id: 456 };
      const user: IUser = { id: 64027 };
      charityHubUser.user = user;

      const userCollection: IUser[] = [{ id: 61036 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call userPage query and add missing value', () => {
      const charityHubUser: ICharityHubUser = { id: 456 };
      const userPage: IUserPage = { id: 50836 };
      charityHubUser.userPage = userPage;

      const userPageCollection: IUserPage[] = [{ id: 13323 }];
      jest.spyOn(userPageService, 'query').mockReturnValue(of(new HttpResponse({ body: userPageCollection })));
      const expectedCollection: IUserPage[] = [userPage, ...userPageCollection];
      jest.spyOn(userPageService, 'addUserPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      expect(userPageService.query).toHaveBeenCalled();
      expect(userPageService.addUserPageToCollectionIfMissing).toHaveBeenCalledWith(userPageCollection, userPage);
      expect(comp.userPagesCollection).toEqual(expectedCollection);
    });

    it('Should call authentication query and add missing value', () => {
      const charityHubUser: ICharityHubUser = { id: 456 };
      const authentication: IAuthentication = { id: 20393 };
      charityHubUser.authentication = authentication;

      const authenticationCollection: IAuthentication[] = [{ id: 1362 }];
      jest.spyOn(authenticationService, 'query').mockReturnValue(of(new HttpResponse({ body: authenticationCollection })));
      const expectedCollection: IAuthentication[] = [authentication, ...authenticationCollection];
      jest.spyOn(authenticationService, 'addAuthenticationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      expect(authenticationService.query).toHaveBeenCalled();
      expect(authenticationService.addAuthenticationToCollectionIfMissing).toHaveBeenCalledWith(authenticationCollection, authentication);
      expect(comp.authenticationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityHubUser: ICharityHubUser = { id: 456 };
      const user: IUser = { id: 42396 };
      charityHubUser.user = user;
      const userPage: IUserPage = { id: 22914 };
      charityHubUser.userPage = userPage;
      const authentication: IAuthentication = { id: 36878 };
      charityHubUser.authentication = authentication;

      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userPagesCollection).toContain(userPage);
      expect(comp.authenticationsCollection).toContain(authentication);
      expect(comp.charityHubUser).toEqual(charityHubUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityHubUser>>();
      const charityHubUser = { id: 123 };
      jest.spyOn(charityHubUserFormService, 'getCharityHubUser').mockReturnValue(charityHubUser);
      jest.spyOn(charityHubUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityHubUser }));
      saveSubject.complete();

      // THEN
      expect(charityHubUserFormService.getCharityHubUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityHubUserService.update).toHaveBeenCalledWith(expect.objectContaining(charityHubUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityHubUser>>();
      const charityHubUser = { id: 123 };
      jest.spyOn(charityHubUserFormService, 'getCharityHubUser').mockReturnValue({ id: null });
      jest.spyOn(charityHubUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityHubUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityHubUser }));
      saveSubject.complete();

      // THEN
      expect(charityHubUserFormService.getCharityHubUser).toHaveBeenCalled();
      expect(charityHubUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityHubUser>>();
      const charityHubUser = { id: 123 };
      jest.spyOn(charityHubUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityHubUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareAuthentication', () => {
      it('Should forward to authenticationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(authenticationService, 'compareAuthentication');
        comp.compareAuthentication(entity, entity2);
        expect(authenticationService.compareAuthentication).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
