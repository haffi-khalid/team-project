import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../group-donator-collector.test-samples';

import { GroupDonatorCollectorFormService } from './group-donator-collector-form.service';

describe('GroupDonatorCollector Form Service', () => {
  let service: GroupDonatorCollectorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupDonatorCollectorFormService);
  });

  describe('Service methods', () => {
    describe('createGroupDonatorCollectorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            donatorName: expect.any(Object),
            donationAmount: expect.any(Object),
            groupDonator: expect.any(Object),
          })
        );
      });

      it('passing IGroupDonatorCollector should create a new form with FormGroup', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            donatorName: expect.any(Object),
            donationAmount: expect.any(Object),
            groupDonator: expect.any(Object),
          })
        );
      });
    });

    describe('getGroupDonatorCollector', () => {
      it('should return NewGroupDonatorCollector for default GroupDonatorCollector initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGroupDonatorCollectorFormGroup(sampleWithNewData);

        const groupDonatorCollector = service.getGroupDonatorCollector(formGroup) as any;

        expect(groupDonatorCollector).toMatchObject(sampleWithNewData);
      });

      it('should return NewGroupDonatorCollector for empty GroupDonatorCollector initial value', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup();

        const groupDonatorCollector = service.getGroupDonatorCollector(formGroup) as any;

        expect(groupDonatorCollector).toMatchObject({});
      });

      it('should return IGroupDonatorCollector', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup(sampleWithRequiredData);

        const groupDonatorCollector = service.getGroupDonatorCollector(formGroup) as any;

        expect(groupDonatorCollector).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGroupDonatorCollector should not enable id FormControl', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGroupDonatorCollector should disable id FormControl', () => {
        const formGroup = service.createGroupDonatorCollectorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
