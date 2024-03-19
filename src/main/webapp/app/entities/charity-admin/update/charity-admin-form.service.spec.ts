import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity-admin.test-samples';

import { CharityAdminFormService } from './charity-admin-form.service';

describe('CharityAdmin Form Service', () => {
  let service: CharityAdminFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityAdminFormService);
  });

  describe('Service methods', () => {
    describe('createCharityAdminFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityAdminFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            isCharityAdmin: expect.any(Object),
            budgetPlanner: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });

      it('passing ICharityAdmin should create a new form with FormGroup', () => {
        const formGroup = service.createCharityAdminFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            isCharityAdmin: expect.any(Object),
            budgetPlanner: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getCharityAdmin', () => {
      it('should return NewCharityAdmin for default CharityAdmin initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityAdminFormGroup(sampleWithNewData);

        const charityAdmin = service.getCharityAdmin(formGroup) as any;

        expect(charityAdmin).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharityAdmin for empty CharityAdmin initial value', () => {
        const formGroup = service.createCharityAdminFormGroup();

        const charityAdmin = service.getCharityAdmin(formGroup) as any;

        expect(charityAdmin).toMatchObject({});
      });

      it('should return ICharityAdmin', () => {
        const formGroup = service.createCharityAdminFormGroup(sampleWithRequiredData);

        const charityAdmin = service.getCharityAdmin(formGroup) as any;

        expect(charityAdmin).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharityAdmin should not enable id FormControl', () => {
        const formGroup = service.createCharityAdminFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharityAdmin should disable id FormControl', () => {
        const formGroup = service.createCharityAdminFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
