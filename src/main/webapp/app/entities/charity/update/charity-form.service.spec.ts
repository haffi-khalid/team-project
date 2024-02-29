import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity.test-samples';

import { CharityFormService } from './charity-form.service';

describe('Charity Form Service', () => {
  let service: CharityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityFormService);
  });

  describe('Service methods', () => {
    describe('createCharityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing ICharity should create a new form with FormGroup', () => {
        const formGroup = service.createCharityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getCharity', () => {
      it('should return NewCharity for default Charity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityFormGroup(sampleWithNewData);

        const charity = service.getCharity(formGroup) as any;

        expect(charity).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharity for empty Charity initial value', () => {
        const formGroup = service.createCharityFormGroup();

        const charity = service.getCharity(formGroup) as any;

        expect(charity).toMatchObject({});
      });

      it('should return ICharity', () => {
        const formGroup = service.createCharityFormGroup(sampleWithRequiredData);

        const charity = service.getCharity(formGroup) as any;

        expect(charity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharity should not enable id FormControl', () => {
        const formGroup = service.createCharityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharity should disable id FormControl', () => {
        const formGroup = service.createCharityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
