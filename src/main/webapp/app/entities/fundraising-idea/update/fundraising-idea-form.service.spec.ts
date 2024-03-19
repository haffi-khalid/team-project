import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fundraising-idea.test-samples';

import { FundraisingIdeaFormService } from './fundraising-idea-form.service';

describe('FundraisingIdea Form Service', () => {
  let service: FundraisingIdeaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundraisingIdeaFormService);
  });

  describe('Service methods', () => {
    describe('createFundraisingIdeaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFundraisingIdeaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ideaName: expect.any(Object),
            ideaDescription: expect.any(Object),
            numberOfVolunteers: expect.any(Object),
            location: expect.any(Object),
            expectedCost: expect.any(Object),
            expectedAttendance: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });

      it('passing IFundraisingIdea should create a new form with FormGroup', () => {
        const formGroup = service.createFundraisingIdeaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ideaName: expect.any(Object),
            ideaDescription: expect.any(Object),
            numberOfVolunteers: expect.any(Object),
            location: expect.any(Object),
            expectedCost: expect.any(Object),
            expectedAttendance: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getFundraisingIdea', () => {
      it('should return NewFundraisingIdea for default FundraisingIdea initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFundraisingIdeaFormGroup(sampleWithNewData);

        const fundraisingIdea = service.getFundraisingIdea(formGroup) as any;

        expect(fundraisingIdea).toMatchObject(sampleWithNewData);
      });

      it('should return NewFundraisingIdea for empty FundraisingIdea initial value', () => {
        const formGroup = service.createFundraisingIdeaFormGroup();

        const fundraisingIdea = service.getFundraisingIdea(formGroup) as any;

        expect(fundraisingIdea).toMatchObject({});
      });

      it('should return IFundraisingIdea', () => {
        const formGroup = service.createFundraisingIdeaFormGroup(sampleWithRequiredData);

        const fundraisingIdea = service.getFundraisingIdea(formGroup) as any;

        expect(fundraisingIdea).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFundraisingIdea should not enable id FormControl', () => {
        const formGroup = service.createFundraisingIdeaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFundraisingIdea should disable id FormControl', () => {
        const formGroup = service.createFundraisingIdeaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
