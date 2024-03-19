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

import { CharityHubUserUpdateComponent } from './charity-hub-user-update.component';

describe('CharityHubUser Management Update Component', () => {
  let comp: CharityHubUserUpdateComponent;
  let fixture: ComponentFixture<CharityHubUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityHubUserFormService: CharityHubUserFormService;
  let charityHubUserService: CharityHubUserService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const charityHubUser: ICharityHubUser = { id: 456 };

      activatedRoute.data = of({ charityHubUser });
      comp.ngOnInit();

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
});
