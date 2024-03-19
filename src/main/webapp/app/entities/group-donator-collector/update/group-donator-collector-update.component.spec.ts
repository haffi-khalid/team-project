import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GroupDonatorCollectorFormService } from './group-donator-collector-form.service';
import { GroupDonatorCollectorService } from '../service/group-donator-collector.service';
import { IGroupDonatorCollector } from '../group-donator-collector.model';
import { IGroupDonator } from 'app/entities/group-donator/group-donator.model';
import { GroupDonatorService } from 'app/entities/group-donator/service/group-donator.service';

import { GroupDonatorCollectorUpdateComponent } from './group-donator-collector-update.component';

describe('GroupDonatorCollector Management Update Component', () => {
  let comp: GroupDonatorCollectorUpdateComponent;
  let fixture: ComponentFixture<GroupDonatorCollectorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let groupDonatorCollectorFormService: GroupDonatorCollectorFormService;
  let groupDonatorCollectorService: GroupDonatorCollectorService;
  let groupDonatorService: GroupDonatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GroupDonatorCollectorUpdateComponent],
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
      .overrideTemplate(GroupDonatorCollectorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupDonatorCollectorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    groupDonatorCollectorFormService = TestBed.inject(GroupDonatorCollectorFormService);
    groupDonatorCollectorService = TestBed.inject(GroupDonatorCollectorService);
    groupDonatorService = TestBed.inject(GroupDonatorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call groupDonator query and add missing value', () => {
      const groupDonatorCollector: IGroupDonatorCollector = { id: 456 };
      const groupDonator: IGroupDonator = { id: 64562 };
      groupDonatorCollector.groupDonator = groupDonator;

      const groupDonatorCollection: IGroupDonator[] = [{ id: 44060 }];
      jest.spyOn(groupDonatorService, 'query').mockReturnValue(of(new HttpResponse({ body: groupDonatorCollection })));
      const expectedCollection: IGroupDonator[] = [groupDonator, ...groupDonatorCollection];
      jest.spyOn(groupDonatorService, 'addGroupDonatorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ groupDonatorCollector });
      comp.ngOnInit();

      expect(groupDonatorService.query).toHaveBeenCalled();
      expect(groupDonatorService.addGroupDonatorToCollectionIfMissing).toHaveBeenCalledWith(groupDonatorCollection, groupDonator);
      expect(comp.groupDonatorsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const groupDonatorCollector: IGroupDonatorCollector = { id: 456 };
      const groupDonator: IGroupDonator = { id: 77124 };
      groupDonatorCollector.groupDonator = groupDonator;

      activatedRoute.data = of({ groupDonatorCollector });
      comp.ngOnInit();

      expect(comp.groupDonatorsCollection).toContain(groupDonator);
      expect(comp.groupDonatorCollector).toEqual(groupDonatorCollector);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonatorCollector>>();
      const groupDonatorCollector = { id: 123 };
      jest.spyOn(groupDonatorCollectorFormService, 'getGroupDonatorCollector').mockReturnValue(groupDonatorCollector);
      jest.spyOn(groupDonatorCollectorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonatorCollector });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupDonatorCollector }));
      saveSubject.complete();

      // THEN
      expect(groupDonatorCollectorFormService.getGroupDonatorCollector).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(groupDonatorCollectorService.update).toHaveBeenCalledWith(expect.objectContaining(groupDonatorCollector));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonatorCollector>>();
      const groupDonatorCollector = { id: 123 };
      jest.spyOn(groupDonatorCollectorFormService, 'getGroupDonatorCollector').mockReturnValue({ id: null });
      jest.spyOn(groupDonatorCollectorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonatorCollector: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupDonatorCollector }));
      saveSubject.complete();

      // THEN
      expect(groupDonatorCollectorFormService.getGroupDonatorCollector).toHaveBeenCalled();
      expect(groupDonatorCollectorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonatorCollector>>();
      const groupDonatorCollector = { id: 123 };
      jest.spyOn(groupDonatorCollectorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonatorCollector });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(groupDonatorCollectorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGroupDonator', () => {
      it('Should forward to groupDonatorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupDonatorService, 'compareGroupDonator');
        comp.compareGroupDonator(entity, entity2);
        expect(groupDonatorService.compareGroupDonator).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
