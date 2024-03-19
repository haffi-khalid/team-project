import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../volunteer-applications.test-samples';

import { VolunteerApplicationsFormService } from './volunteer-applications-form.service';

describe('VolunteerApplications Form Service', () => {
  let service: VolunteerApplicationsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolunteerApplicationsFormService);
  });

  describe('Service methods', () => {
    describe('createVolunteerApplicationsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timeStamp: expect.any(Object),
            volunteerStatus: expect.any(Object),
            charityProfile: expect.any(Object),
            userPage: expect.any(Object),
            vacancies: expect.any(Object),
          })
        );
      });

      it('passing IVolunteerApplications should create a new form with FormGroup', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timeStamp: expect.any(Object),
            volunteerStatus: expect.any(Object),
            charityProfile: expect.any(Object),
            userPage: expect.any(Object),
            vacancies: expect.any(Object),
          })
        );
      });
    });

    describe('getVolunteerApplications', () => {
      it('should return NewVolunteerApplications for default VolunteerApplications initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVolunteerApplicationsFormGroup(sampleWithNewData);

        const volunteerApplications = service.getVolunteerApplications(formGroup) as any;

        expect(volunteerApplications).toMatchObject(sampleWithNewData);
      });

      it('should return NewVolunteerApplications for empty VolunteerApplications initial value', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup();

        const volunteerApplications = service.getVolunteerApplications(formGroup) as any;

        expect(volunteerApplications).toMatchObject({});
      });

      it('should return IVolunteerApplications', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup(sampleWithRequiredData);

        const volunteerApplications = service.getVolunteerApplications(formGroup) as any;

        expect(volunteerApplications).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVolunteerApplications should not enable id FormControl', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVolunteerApplications should disable id FormControl', () => {
        const formGroup = service.createVolunteerApplicationsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
