import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity-hub-user.test-samples';

import { CharityHubUserFormService } from './charity-hub-user-form.service';

describe('CharityHubUser Form Service', () => {
  let service: CharityHubUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityHubUserFormService);
  });

  describe('Service methods', () => {
    describe('createCharityHubUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityHubUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            email: expect.any(Object),
          })
        );
      });

      it('passing ICharityHubUser should create a new form with FormGroup', () => {
        const formGroup = service.createCharityHubUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            email: expect.any(Object),
          })
        );
      });
    });

    describe('getCharityHubUser', () => {
      it('should return NewCharityHubUser for default CharityHubUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityHubUserFormGroup(sampleWithNewData);

        const charityHubUser = service.getCharityHubUser(formGroup) as any;

        expect(charityHubUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharityHubUser for empty CharityHubUser initial value', () => {
        const formGroup = service.createCharityHubUserFormGroup();

        const charityHubUser = service.getCharityHubUser(formGroup) as any;

        expect(charityHubUser).toMatchObject({});
      });

      it('should return ICharityHubUser', () => {
        const formGroup = service.createCharityHubUserFormGroup(sampleWithRequiredData);

        const charityHubUser = service.getCharityHubUser(formGroup) as any;

        expect(charityHubUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharityHubUser should not enable id FormControl', () => {
        const formGroup = service.createCharityHubUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharityHubUser should disable id FormControl', () => {
        const formGroup = service.createCharityHubUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
