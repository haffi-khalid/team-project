import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../review-comments.test-samples';

import { ReviewCommentsFormService } from './review-comments-form.service';

describe('ReviewComments Form Service', () => {
  let service: ReviewCommentsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewCommentsFormService);
  });

  describe('Service methods', () => {
    describe('createReviewCommentsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReviewCommentsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parentID: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            status: expect.any(Object),
            charityHubUser: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });

      it('passing IReviewComments should create a new form with FormGroup', () => {
        const formGroup = service.createReviewCommentsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parentID: expect.any(Object),
            content: expect.any(Object),
            timestamp: expect.any(Object),
            status: expect.any(Object),
            charityHubUser: expect.any(Object),
            charityProfile: expect.any(Object),
          })
        );
      });
    });

    describe('getReviewComments', () => {
      it('should return NewReviewComments for default ReviewComments initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createReviewCommentsFormGroup(sampleWithNewData);

        const reviewComments = service.getReviewComments(formGroup) as any;

        expect(reviewComments).toMatchObject(sampleWithNewData);
      });

      it('should return NewReviewComments for empty ReviewComments initial value', () => {
        const formGroup = service.createReviewCommentsFormGroup();

        const reviewComments = service.getReviewComments(formGroup) as any;

        expect(reviewComments).toMatchObject({});
      });

      it('should return IReviewComments', () => {
        const formGroup = service.createReviewCommentsFormGroup(sampleWithRequiredData);

        const reviewComments = service.getReviewComments(formGroup) as any;

        expect(reviewComments).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReviewComments should not enable id FormControl', () => {
        const formGroup = service.createReviewCommentsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReviewComments should disable id FormControl', () => {
        const formGroup = service.createReviewCommentsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
