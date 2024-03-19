import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity-profile.test-samples';

import { CharityProfileFormService } from './charity-profile-form.service';

describe('CharityProfile Form Service', () => {
  let service: CharityProfileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityProfileFormService);
  });

  describe('Service methods', () => {
    describe('createCharityProfileFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityProfileFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            purpose: expect.any(Object),
            aim: expect.any(Object),
            emailAddress: expect.any(Object),
            logo: expect.any(Object),
            pictures: expect.any(Object),
            budgetPlanner: expect.any(Object),
            socialFeed: expect.any(Object),
          })
        );
      });

      it('passing ICharityProfile should create a new form with FormGroup', () => {
        const formGroup = service.createCharityProfileFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            purpose: expect.any(Object),
            aim: expect.any(Object),
            emailAddress: expect.any(Object),
            logo: expect.any(Object),
            pictures: expect.any(Object),
            budgetPlanner: expect.any(Object),
            socialFeed: expect.any(Object),
          })
        );
      });
    });

    describe('getCharityProfile', () => {
      it('should return NewCharityProfile for default CharityProfile initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityProfileFormGroup(sampleWithNewData);

        const charityProfile = service.getCharityProfile(formGroup) as any;

        expect(charityProfile).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharityProfile for empty CharityProfile initial value', () => {
        const formGroup = service.createCharityProfileFormGroup();

        const charityProfile = service.getCharityProfile(formGroup) as any;

        expect(charityProfile).toMatchObject({});
      });

      it('should return ICharityProfile', () => {
        const formGroup = service.createCharityProfileFormGroup(sampleWithRequiredData);

        const charityProfile = service.getCharityProfile(formGroup) as any;

        expect(charityProfile).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharityProfile should not enable id FormControl', () => {
        const formGroup = service.createCharityProfileFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharityProfile should disable id FormControl', () => {
        const formGroup = service.createCharityProfileFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
