import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReviewComments, NewReviewComments } from '../review-comments.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReviewComments for edit and NewReviewCommentsFormGroupInput for create.
 */
type ReviewCommentsFormGroupInput = IReviewComments | PartialWithRequiredKeyOf<NewReviewComments>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReviewComments | NewReviewComments> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ReviewCommentsFormRawValue = FormValueOf<IReviewComments>;

type NewReviewCommentsFormRawValue = FormValueOf<NewReviewComments>;

type ReviewCommentsFormDefaults = Pick<NewReviewComments, 'id' | 'timestamp'>;

type ReviewCommentsFormGroupContent = {
  id: FormControl<ReviewCommentsFormRawValue['id'] | NewReviewComments['id']>;
  parentID: FormControl<ReviewCommentsFormRawValue['parentID']>;
  content: FormControl<ReviewCommentsFormRawValue['content']>;
  timestamp: FormControl<ReviewCommentsFormRawValue['timestamp']>;
  status: FormControl<ReviewCommentsFormRawValue['status']>;
  likeCount: FormControl<ReviewCommentsFormRawValue['likeCount']>;
  userPage: FormControl<ReviewCommentsFormRawValue['userPage']>;
  charityProfile: FormControl<ReviewCommentsFormRawValue['charityProfile']>;
};

export type ReviewCommentsFormGroup = FormGroup<ReviewCommentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReviewCommentsFormService {
  createReviewCommentsFormGroup(reviewComments: ReviewCommentsFormGroupInput = { id: null }): ReviewCommentsFormGroup {
    const reviewCommentsRawValue = this.convertReviewCommentsToReviewCommentsRawValue({
      ...this.getFormDefaults(),
      ...reviewComments,
    });
    return new FormGroup<ReviewCommentsFormGroupContent>({
      id: new FormControl(
        { value: reviewCommentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parentID: new FormControl(reviewCommentsRawValue.parentID),
      content: new FormControl(reviewCommentsRawValue.content),
      timestamp: new FormControl(reviewCommentsRawValue.timestamp),
      status: new FormControl(reviewCommentsRawValue.status),
      likeCount: new FormControl(reviewCommentsRawValue.likeCount),
      userPage: new FormControl(reviewCommentsRawValue.userPage),
      charityProfile: new FormControl(reviewCommentsRawValue.charityProfile),
    });
  }

  getReviewComments(form: ReviewCommentsFormGroup): IReviewComments | NewReviewComments {
    return this.convertReviewCommentsRawValueToReviewComments(
      form.getRawValue() as ReviewCommentsFormRawValue | NewReviewCommentsFormRawValue
    );
  }

  resetForm(form: ReviewCommentsFormGroup, reviewComments: ReviewCommentsFormGroupInput): void {
    const reviewCommentsRawValue = this.convertReviewCommentsToReviewCommentsRawValue({ ...this.getFormDefaults(), ...reviewComments });
    form.reset(
      {
        ...reviewCommentsRawValue,
        id: { value: reviewCommentsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReviewCommentsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertReviewCommentsRawValueToReviewComments(
    rawReviewComments: ReviewCommentsFormRawValue | NewReviewCommentsFormRawValue
  ): IReviewComments | NewReviewComments {
    return {
      ...rawReviewComments,
      timestamp: dayjs(rawReviewComments.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertReviewCommentsToReviewCommentsRawValue(
    reviewComments: IReviewComments | (Partial<NewReviewComments> & ReviewCommentsFormDefaults)
  ): ReviewCommentsFormRawValue | PartialWithRequiredKeyOf<NewReviewCommentsFormRawValue> {
    return {
      ...reviewComments,
      timestamp: reviewComments.timestamp ? reviewComments.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
