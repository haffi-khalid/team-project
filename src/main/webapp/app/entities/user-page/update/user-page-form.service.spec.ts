import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-page.test-samples';

import { UserPageFormService } from './user-page-form.service';

describe('UserPage Form Service', () => {
  let service: UserPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPageFormService);
  });

  describe('Service methods', () => {
    describe('createUserPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            profilePicture: expect.any(Object),
            name: expect.any(Object),
            userBio: expect.any(Object),
            volunteerHours: expect.any(Object),
            reviewComment: expect.any(Object),
            course: expect.any(Object),
            skills: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserPage should create a new form with FormGroup', () => {
        const formGroup = service.createUserPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            profilePicture: expect.any(Object),
            name: expect.any(Object),
            userBio: expect.any(Object),
            volunteerHours: expect.any(Object),
            reviewComment: expect.any(Object),
            course: expect.any(Object),
            skills: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserPage', () => {
      it('should return NewUserPage for default UserPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserPageFormGroup(sampleWithNewData);

        const userPage = service.getUserPage(formGroup) as any;

        expect(userPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserPage for empty UserPage initial value', () => {
        const formGroup = service.createUserPageFormGroup();

        const userPage = service.getUserPage(formGroup) as any;

        expect(userPage).toMatchObject({});
      });

      it('should return IUserPage', () => {
        const formGroup = service.createUserPageFormGroup(sampleWithRequiredData);

        const userPage = service.getUserPage(formGroup) as any;

        expect(userPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserPage should not enable id FormControl', () => {
        const formGroup = service.createUserPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserPage should disable id FormControl', () => {
        const formGroup = service.createUserPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
