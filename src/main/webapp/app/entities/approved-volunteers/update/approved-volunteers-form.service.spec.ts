import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../approved-volunteers.test-samples';

import { ApprovedVolunteersFormService } from './approved-volunteers-form.service';

describe('ApprovedVolunteers Form Service', () => {
  let service: ApprovedVolunteersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovedVolunteersFormService);
  });

  describe('Service methods', () => {
    describe('createApprovedVolunteersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createApprovedVolunteersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            volunteerStatus: expect.any(Object),
            volunteerHoursCompletedInCharity: expect.any(Object),
            currentEventVolunteeringIn: expect.any(Object),
            charityHubUser: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });

      it('passing IApprovedVolunteers should create a new form with FormGroup', () => {
        const formGroup = service.createApprovedVolunteersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            volunteerStatus: expect.any(Object),
            volunteerHoursCompletedInCharity: expect.any(Object),
            currentEventVolunteeringIn: expect.any(Object),
            charityHubUser: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });
    });

    describe('getApprovedVolunteers', () => {
      it('should return NewApprovedVolunteers for default ApprovedVolunteers initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createApprovedVolunteersFormGroup(sampleWithNewData);

        const approvedVolunteers = service.getApprovedVolunteers(formGroup) as any;

        expect(approvedVolunteers).toMatchObject(sampleWithNewData);
      });

      it('should return NewApprovedVolunteers for empty ApprovedVolunteers initial value', () => {
        const formGroup = service.createApprovedVolunteersFormGroup();

        const approvedVolunteers = service.getApprovedVolunteers(formGroup) as any;

        expect(approvedVolunteers).toMatchObject({});
      });

      it('should return IApprovedVolunteers', () => {
        const formGroup = service.createApprovedVolunteersFormGroup(sampleWithRequiredData);

        const approvedVolunteers = service.getApprovedVolunteers(formGroup) as any;

        expect(approvedVolunteers).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IApprovedVolunteers should not enable id FormControl', () => {
        const formGroup = service.createApprovedVolunteersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewApprovedVolunteers should disable id FormControl', () => {
        const formGroup = service.createApprovedVolunteersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
