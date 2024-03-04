import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../group-donator.test-samples';

import { GroupDonatorFormService } from './group-donator-form.service';

describe('GroupDonator Form Service', () => {
  let service: GroupDonatorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupDonatorFormService);
  });

  describe('Service methods', () => {
    describe('createGroupDonatorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGroupDonatorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupname: expect.any(Object),
            totalCollectedAmount: expect.any(Object),
            donatorPage: expect.any(Object),
            charityEvent: expect.any(Object),
          })
        );
      });

      it('passing IGroupDonator should create a new form with FormGroup', () => {
        const formGroup = service.createGroupDonatorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupname: expect.any(Object),
            totalCollectedAmount: expect.any(Object),
            donatorPage: expect.any(Object),
            charityEvent: expect.any(Object),
          })
        );
      });
    });

    describe('getGroupDonator', () => {
      it('should return NewGroupDonator for default GroupDonator initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGroupDonatorFormGroup(sampleWithNewData);

        const groupDonator = service.getGroupDonator(formGroup) as any;

        expect(groupDonator).toMatchObject(sampleWithNewData);
      });

      it('should return NewGroupDonator for empty GroupDonator initial value', () => {
        const formGroup = service.createGroupDonatorFormGroup();

        const groupDonator = service.getGroupDonator(formGroup) as any;

        expect(groupDonator).toMatchObject({});
      });

      it('should return IGroupDonator', () => {
        const formGroup = service.createGroupDonatorFormGroup(sampleWithRequiredData);

        const groupDonator = service.getGroupDonator(formGroup) as any;

        expect(groupDonator).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGroupDonator should not enable id FormControl', () => {
        const formGroup = service.createGroupDonatorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGroupDonator should disable id FormControl', () => {
        const formGroup = service.createGroupDonatorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
