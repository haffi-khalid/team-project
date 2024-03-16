import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FundraisingIdeaFormService } from './fundraising-idea-form.service';
import { FundraisingIdeaService } from '../service/fundraising-idea.service';
import { IFundraisingIdea } from '../fundraising-idea.model';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';

import { FundraisingIdeaUpdateComponent } from './fundraising-idea-update.component';

describe('FundraisingIdea Management Update Component', () => {
  let comp: FundraisingIdeaUpdateComponent;
  let fixture: ComponentFixture<FundraisingIdeaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fundraisingIdeaFormService: FundraisingIdeaFormService;
  let fundraisingIdeaService: FundraisingIdeaService;
  let charityAdminService: CharityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FundraisingIdeaUpdateComponent],
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
      .overrideTemplate(FundraisingIdeaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FundraisingIdeaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fundraisingIdeaFormService = TestBed.inject(FundraisingIdeaFormService);
    fundraisingIdeaService = TestBed.inject(FundraisingIdeaService);
    charityAdminService = TestBed.inject(CharityAdminService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityAdmin query and add missing value', () => {
      const fundraisingIdea: IFundraisingIdea = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 10802 };
      fundraisingIdea.charityAdmin = charityAdmin;

      const charityAdminCollection: ICharityAdmin[] = [{ id: 38317 }];
      jest.spyOn(charityAdminService, 'query').mockReturnValue(of(new HttpResponse({ body: charityAdminCollection })));
      const additionalCharityAdmins = [charityAdmin];
      const expectedCollection: ICharityAdmin[] = [...additionalCharityAdmins, ...charityAdminCollection];
      jest.spyOn(charityAdminService, 'addCharityAdminToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      expect(charityAdminService.query).toHaveBeenCalled();
      expect(charityAdminService.addCharityAdminToCollectionIfMissing).toHaveBeenCalledWith(
        charityAdminCollection,
        ...additionalCharityAdmins.map(expect.objectContaining)
      );
      expect(comp.charityAdminsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fundraisingIdea: IFundraisingIdea = { id: 456 };
      const charityAdmin: ICharityAdmin = { id: 75452 };
      fundraisingIdea.charityAdmin = charityAdmin;

      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      expect(comp.charityAdminsSharedCollection).toContain(charityAdmin);
      expect(comp.fundraisingIdea).toEqual(fundraisingIdea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaFormService, 'getFundraisingIdea').mockReturnValue(fundraisingIdea);
      jest.spyOn(fundraisingIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fundraisingIdea }));
      saveSubject.complete();

      // THEN
      expect(fundraisingIdeaFormService.getFundraisingIdea).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fundraisingIdeaService.update).toHaveBeenCalledWith(expect.objectContaining(fundraisingIdea));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaFormService, 'getFundraisingIdea').mockReturnValue({ id: null });
      jest.spyOn(fundraisingIdeaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fundraisingIdea }));
      saveSubject.complete();

      // THEN
      expect(fundraisingIdeaFormService.getFundraisingIdea).toHaveBeenCalled();
      expect(fundraisingIdeaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fundraisingIdeaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCharityAdmin', () => {
      it('Should forward to charityAdminService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityAdminService, 'compareCharityAdmin');
        comp.compareCharityAdmin(entity, entity2);
        expect(charityAdminService.compareCharityAdmin).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
