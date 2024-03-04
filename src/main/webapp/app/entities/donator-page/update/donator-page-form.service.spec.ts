import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../donator-page.test-samples';

import { DonatorPageFormService } from './donator-page-form.service';

describe('DonatorPage Form Service', () => {
  let service: DonatorPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonatorPageFormService);
  });

  describe('Service methods', () => {
    describe('createDonatorPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDonatorPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            anonymous: expect.any(Object),
            amount: expect.any(Object),
            groupDonation: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });

      it('passing IDonatorPage should create a new form with FormGroup', () => {
        const formGroup = service.createDonatorPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            anonymous: expect.any(Object),
            amount: expect.any(Object),
            groupDonation: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getDonatorPage', () => {
      it('should return NewDonatorPage for default DonatorPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDonatorPageFormGroup(sampleWithNewData);

        const donatorPage = service.getDonatorPage(formGroup) as any;

        expect(donatorPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewDonatorPage for empty DonatorPage initial value', () => {
        const formGroup = service.createDonatorPageFormGroup();

        const donatorPage = service.getDonatorPage(formGroup) as any;

        expect(donatorPage).toMatchObject({});
      });

      it('should return IDonatorPage', () => {
        const formGroup = service.createDonatorPageFormGroup(sampleWithRequiredData);

        const donatorPage = service.getDonatorPage(formGroup) as any;

        expect(donatorPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDonatorPage should not enable id FormControl', () => {
        const formGroup = service.createDonatorPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDonatorPage should disable id FormControl', () => {
        const formGroup = service.createDonatorPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
