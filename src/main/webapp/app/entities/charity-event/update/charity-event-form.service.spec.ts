import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity-event.test-samples';

import { CharityEventFormService } from './charity-event-form.service';

describe('CharityEvent Form Service', () => {
  let service: CharityEventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityEventFormService);
  });

  describe('Service methods', () => {
    describe('createCharityEventFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityEventFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            eventName: expect.any(Object),
            eventTimeDate: expect.any(Object),
            description: expect.any(Object),
            images: expect.any(Object),
            duration: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });

      it('passing ICharityEvent should create a new form with FormGroup', () => {
        const formGroup = service.createCharityEventFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            eventName: expect.any(Object),
            eventTimeDate: expect.any(Object),
            description: expect.any(Object),
            images: expect.any(Object),
            duration: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });
    });

    describe('getCharityEvent', () => {
      it('should return NewCharityEvent for default CharityEvent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityEventFormGroup(sampleWithNewData);

        const charityEvent = service.getCharityEvent(formGroup) as any;

        expect(charityEvent).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharityEvent for empty CharityEvent initial value', () => {
        const formGroup = service.createCharityEventFormGroup();

        const charityEvent = service.getCharityEvent(formGroup) as any;

        expect(charityEvent).toMatchObject({});
      });

      it('should return ICharityEvent', () => {
        const formGroup = service.createCharityEventFormGroup(sampleWithRequiredData);

        const charityEvent = service.getCharityEvent(formGroup) as any;

        expect(charityEvent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharityEvent should not enable id FormControl', () => {
        const formGroup = service.createCharityEventFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharityEvent should disable id FormControl', () => {
        const formGroup = service.createCharityEventFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
