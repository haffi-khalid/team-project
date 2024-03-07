import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../social-feed.test-samples';

import { SocialFeedFormService } from './social-feed-form.service';

describe('SocialFeed Form Service', () => {
  let service: SocialFeedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialFeedFormService);
  });

  describe('Service methods', () => {
    describe('createSocialFeedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSocialFeedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastUpdated: expect.any(Object),
          })
        );
      });

      it('passing ISocialFeed should create a new form with FormGroup', () => {
        const formGroup = service.createSocialFeedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastUpdated: expect.any(Object),
          })
        );
      });
    });

    describe('getSocialFeed', () => {
      it('should return NewSocialFeed for default SocialFeed initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSocialFeedFormGroup(sampleWithNewData);

        const socialFeed = service.getSocialFeed(formGroup) as any;

        expect(socialFeed).toMatchObject(sampleWithNewData);
      });

      it('should return NewSocialFeed for empty SocialFeed initial value', () => {
        const formGroup = service.createSocialFeedFormGroup();

        const socialFeed = service.getSocialFeed(formGroup) as any;

        expect(socialFeed).toMatchObject({});
      });

      it('should return ISocialFeed', () => {
        const formGroup = service.createSocialFeedFormGroup(sampleWithRequiredData);

        const socialFeed = service.getSocialFeed(formGroup) as any;

        expect(socialFeed).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISocialFeed should not enable id FormControl', () => {
        const formGroup = service.createSocialFeedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSocialFeed should disable id FormControl', () => {
        const formGroup = service.createSocialFeedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
